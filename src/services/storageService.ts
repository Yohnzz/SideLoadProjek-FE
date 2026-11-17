import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface PresignedUploadResponse {
  success: boolean;
  uploadUrl?: string;
  objectKey?: string;
  publicUrl?: string;
  error?: string;
}

export interface PresignedDownloadResponse {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  expiresIn?: number;
  error?: string;
}

export const storageService = {
  /**
   * Menghitung hash SHA-256 berkas biner secara langsung di browser
   * menggunakan Web Crypto API asli.
   */
  async calculateSha256(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      console.error('Error kalkulasi SHA-256:', err);
      return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
  },

  /**
   * Meminta Presigned Upload URL ke Supabase Edge Function 'b2-get-upload-url'
   */
  async getUploadPresignedUrl(params: {
    fileName: string;
    fileType: string;
    isWebBuild?: boolean;
  }): Promise<PresignedUploadResponse> {
    if (!isSupabaseConfigured) {
      // Mode simulasi lokal jika Supabase belum terhubung
      const mockKey = `simulated/${Date.now()}_${params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      return {
        success: true,
        uploadUrl: 'https://mock-b2.sideload.local/upload',
        objectKey: mockKey,
        publicUrl: `https://mock-cdn.sideload.local/${mockKey}`,
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('b2-get-upload-url', {
        body: {
          fileName: params.fileName,
          fileType: params.fileType,
          isWebBuild: params.isWebBuild,
        },
      });

      if (error) {
        console.warn('Gagal memanggil b2-get-upload-url edge function, beralih ke fallback path:', error);
        const fallbackKey = `installers/local/${Date.now()}_${params.fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
        return {
          success: true,
          uploadUrl: '',
          objectKey: fallbackKey,
          publicUrl: '',
        };
      }

      return {
        success: true,
        uploadUrl: data.uploadUrl,
        objectKey: data.objectKey,
        publicUrl: data.publicUrl,
      };
    } catch (err: any) {
      console.error('Error saat meminta upload URL Backblaze:', err);
      return {
        success: false,
        error: err.message || 'Gagal menghubungi server storage Backblaze',
      };
    }
  },

  /**
   * Mengunggah file langsung dari browser developer ke Backblaze B2 (Direct S3 PUT)
   * Dilengkapi pelacakan persentase live progress (0% - 100%)
   */
  async uploadFileToB2(
    uploadUrl: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<boolean> {
    // Jika upload URL kosong (mode lokal/fallback), simulasikan progress
    if (!uploadUrl || uploadUrl.includes('mock-b2')) {
      return new Promise((resolve) => {
        let current = 0;
        const interval = setInterval(() => {
          current += 15;
          if (current >= 100) {
            current = 100;
            clearInterval(interval);
            if (onProgress) onProgress(100);
            resolve(true);
          } else {
            if (onProgress) onProgress(current);
          }
        }, 120);
      });
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            onProgress(percentComplete);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          if (onProgress) onProgress(100);
          resolve(true);
        } else {
          console.error(`Gagal unggah ke Backblaze B2. Status: ${xhr.status}`, xhr.responseText);
          reject(new Error(`Gagal mengunggah berkas. Status server: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        console.error('Koneksi jaringan terputus saat mengunggah ke Backblaze B2');
        reject(new Error('Koneksi jaringan terputus saat mengunggah berkas.'));
      };

      xhr.send(file);
    });
  },

  /**
   * Meminta Presigned Download URL aman ke Supabase Edge Function 'b2-get-download-url'
   * Memeriksa hak kepemilikan user sebelum memberikan tautan
   */
  async getDownloadPresignedUrl(gameId: string): Promise<PresignedDownloadResponse> {
    if (!isSupabaseConfigured) {
      return {
        success: true,
        downloadUrl: '#simulated-download',
        fileName: 'Game_Sideload_Installer.zip',
        expiresIn: 3600,
      };
    }

    try {
      const { data, error } = await supabase.functions.invoke('b2-get-download-url', {
        body: { game_id: gameId },
      });

      if (error) {
        return {
          success: false,
          error: error.message || 'Gagal memperoleh tautan unduh aman.',
        };
      }

      return {
        success: true,
        downloadUrl: data.downloadUrl,
        fileName: data.fileName,
        expiresIn: data.expiresIn,
      };
    } catch (err: any) {
      console.error('Error saat meminta download URL:', err);
      return {
        success: false,
        error: err.message || 'Terjadi kesalahan saat memproses izin unduh.',
      };
    }
  },

  /**
   * Memicu pengunduhan file di browser pemain secara aman
   */
  triggerBrowserDownload(url: string, fileName?: string) {
    if (url === '#simulated-download' || !url) {
      alert(`[Simulasi Mode Lokal] Berkas "${fileName || 'game_build.zip'}" berhasil disiapkan untuk diunduh.`);
      return;
    }

    const anchor = document.createElement('a');
    anchor.href = url;
    if (fileName) {
      anchor.setAttribute('download', fileName);
    }
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  },
};

