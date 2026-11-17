import React, { useState } from 'react';
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileArchive,
  Check,
  Globe,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Checkbox, Badge, Stepper, ProgressBar } from '../components/ui';
import { gameService } from '../services/gameService';
import { storageService } from '../services/storageService';
import type { UserProfile } from '../types/game';

interface SubmitGamePageProps {
  currentUser?: UserProfile;
  onBack: () => void;
  onSubmitSuccess: () => void;
}

export const SubmitGamePage: React.FC<SubmitGamePageProps> = ({
  currentUser,
  onBack,
  onSubmitSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Langkah 1: Info Dasar
  const [title, setTitle] = useState('Kala: Warisan Kabut');
  const [genre, setGenre] = useState('Petualangan Naratif');
  const [tags, setTags] = useState('pixel-art, atmosferik, mitologi, eksplorasi');
  const [shortDescription, setShortDescription] = useState(
    'Kala: Warisan Kabut adalah sebuah petualangan naratif bergaya seni piksel atmosferik yang berlatar di lembah mistis pegunungan Dieng. Pemain berperan sebagai penjaga lentera yang harus menyingkap simpul waktu kuno sebelum kabut menelan desanya selamanya.'
  );

  // Langkah 2: Berkas & Platform
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['win', 'web']);
  
  // Paket WebGL (HTML5 ZIP)
  const [webFileName, setWebFileName] = useState('Kala_WarisanKabut_v1.0.0_WebGL.zip');
  const [webFileSize, setWebFileSize] = useState('66.4 MB');
  const [webSha256, setWebSha256] = useState('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  const [webUploadProgress, setWebUploadProgress] = useState(100);
  const [webBuildUrl, setWebBuildUrl] = useState('');
  const [isWebUploading, setIsWebUploading] = useState(false);
  const webFileRef = React.useRef<HTMLInputElement | null>(null);

  // Paket Unduhan Standalone (Windows / Android)
  const [installerFileName, setInstallerFileName] = useState('Kala_WarisanKabut_v1.0.0_Win64.zip');
  const [installerFileSize, setInstallerFileSize] = useState('412.4 MB');
  const [installerSha256, setInstallerSha256] = useState('a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0');
  const [installerUploadProgress, setInstallerUploadProgress] = useState(100);
  const [storageFilePath, setStorageFilePath] = useState('installers/demo/Kala_WarisanKabut_v1.0.0_Win64.zip');
  const [isInstallerUploading, setIsInstallerUploading] = useState(false);
  const installerFileRef = React.useRef<HTMLInputElement | null>(null);

  // Langkah 3: Media
  const [coverUrl, setCoverUrl] = useState(
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop'
  );
  const [trailerUrl, setTrailerUrl] = useState('');

  // Langkah 4: Harga & Akses
  const [pricingModel, setPricingModel] = useState<'free' | 'pwyw' | 'fixed'>('fixed');
  const [priceInput, setPriceInput] = useState('45000');
  const [ratingCategory, setRatingCategory] = useState<'su' | 'r13' | 'd18'>('r13');
  const [agreeOriginal, setAgreeOriginal] = useState(true);
  const [agreeSafe, setAgreeSafe] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Kalkulasi Harga & Bagi Hasil 98% / 2%
  const numPrice = pricingModel === 'free' ? 0 : parseInt(priceInput.replace(/\D/g, ''), 10) || 0;
  const platformFee = Math.round(numPrice * 0.02); // 2%
  const netStudio = numPrice - platformFee; // 98%

  const steps = [
    { title: 'Info Dasar', description: 'Metadata karya & genre' },
    { title: 'Berkas & Platform', description: 'WebGL & installer unduhan' },
    { title: 'Media & Etalase', description: 'Cover art & tangkapan layar' },
    { title: 'Harga & Bagi Hasil', description: 'Kalkulasi 98% royalti studio' },
  ];

  const togglePlatform = (p: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleSelectWebFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setWebFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setWebFileSize(sizeMb);
    setIsWebUploading(true);
    setWebUploadProgress(5);

    try {
      const hash = await storageService.calculateSha256(file);
      setWebSha256(hash);
      setWebUploadProgress(20);

      const presigned = await storageService.getUploadPresignedUrl({
        fileName: file.name,
        fileType: file.type || 'application/zip',
        isWebBuild: true,
      });

      if (presigned.uploadUrl) {
        await storageService.uploadFileToB2(presigned.uploadUrl, file, (percent) => {
          setWebUploadProgress(Math.max(20, percent));
        });
      } else {
        setWebUploadProgress(100);
      }

      if (presigned.publicUrl) {
        setWebBuildUrl(presigned.publicUrl);
      }
    } catch (err: any) {
      console.error('Error unggah paket WebGL:', err);
      setErrorMessage(err.message || 'Gagal mengunggah paket WebGL.');
    } finally {
      setIsWebUploading(false);
    }
  };

  const handleSelectInstallerFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInstallerFileName(file.name);
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setInstallerFileSize(sizeMb);
    setIsInstallerUploading(true);
    setInstallerUploadProgress(5);

    try {
      const hash = await storageService.calculateSha256(file);
      setInstallerSha256(hash);
      setInstallerUploadProgress(20);

      const presigned = await storageService.getUploadPresignedUrl({
        fileName: file.name,
        fileType: file.type || 'application/octet-stream',
        isWebBuild: false,
      });

      if (presigned.uploadUrl) {
        await storageService.uploadFileToB2(presigned.uploadUrl, file, (percent) => {
          setInstallerUploadProgress(Math.max(20, percent));
        });
      } else {
        setInstallerUploadProgress(100);
      }

      if (presigned.objectKey) {
        setStorageFilePath(presigned.objectKey);
      }
    } catch (err: any) {
      console.error('Error unggah berkas installer:', err);
      setErrorMessage(err.message || 'Gagal mengunggah berkas installer.');
    } finally {
      setIsInstallerUploading(false);
    }
  };

  const handleSubmit = async (isDraft = false) => {
    setErrorMessage(null);

    if (!isDraft) {
      if (!agreeOriginal || !agreeSafe) {
        setErrorMessage('Harap setujui deklarasi orisinalitas dan jaminan keamanan berkas sebelum mengirim.');
        return;
      }
      if (!title.trim() || selectedPlatforms.length === 0) {
        setErrorMessage('Judul karya dan minimal satu platform target wajib ditentukan.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const res = await gameService.submitNewGame({
        developerId: currentUser?.id || 'usr-temp',
        title: title.trim(),
        genre,
        platforms: selectedPlatforms.map((p) => p.toUpperCase()),
        price: numPrice,
        shortDescription: shortDescription.trim(),
        description: shortDescription.trim(),
        coverUrl: coverUrl.trim(),
        screenshots: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=900&auto=format&fit=crop',
        ],
        version: 'v1.0.0',
        fileSize: installerFileSize || webFileSize || '412.4 MB',
        ratingCategory:
          ratingCategory === 'su'
            ? 'Semua Umur (SU)'
            : ratingCategory === 'r13'
            ? 'Remaja (13+)'
            : 'Dewasa (18+)',
        sha256Hash: installerSha256 || webSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        storageFilePath: storageFilePath || undefined,
        webBuildUrl: webBuildUrl || undefined,
      });

      if (!res.success && res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      onSubmitSuccess();
    } catch (err: any) {
      console.error('Error saat pengajuan karya:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan sistem saat menyimpan rilis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#737887] hover:text-[#171923] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dasbor Developer</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
            Formulir Pengajuan Game & Aplikasi
          </h1>
          <p className="text-xs text-[#737887] mt-0.5">
            Lengkapi data teknis, berkas instalasi, dan kalkulasi royalti untuk proses kurasi katalog SideLoad.
          </p>
        </div>

        <Badge variant="neutral" size="sm">
          Draf Otomatis Tersimpan
        </Badge>
      </div>

      {/* Stepper 4 Langkah */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => setCurrentStep(step)}
      />

      {/* Banner Error */}
      {errorMessage && (
        <div className="p-3.5 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] flex items-start gap-2.5 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Konten Langkah 1: Info Dasar */}
      {currentStep === 1 && (
        <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-base font-bold text-[#171923]">Langkah 1: Informasi Dasar Produk</h2>
            <p className="text-xs text-[#737887]">Identitas utama yang akan ditampilkan pada etalase dan hasil pencarian.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Judul Game atau Aplikasi"
              required
              placeholder="Contoh: Kala: Warisan Kabut"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              helperText="Gunakan nama resminya tanpa imbuhan promosi atau diskon."
            />

            <Select
              label="Genre atau Kategori Utama"
              required
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              options={[
                { value: 'Petualangan Naratif', label: 'Petualangan Naratif' },
                { value: 'Pixel RPG', label: 'Pixel RPG & Turn-Based' },
                { value: 'Eksplorasi Alam', label: 'Eksplorasi Alam & Santai' },
                { value: 'Puzzle & Strategi', label: 'Puzzle & Strategi' },
                { value: 'Aplikasi Kreatif', label: 'Aplikasi Kreatif & Produktivitas' },
              ]}
            />
          </div>

          <Input
            label="Tag & Kata Kunci Terkait"
            placeholder="pixel-art, indonesia, dieng, mitologi, 2d"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            helperText="Pisahkan dengan tanda koma untuk membantu rekomendasi kurator."
          />

          <Textarea
            label="Deskripsi Singkat & Sinopsis Game"
            required
            rows={5}
            maxLength={1000}
            showCharCount
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            helperText="Minimal 50 kata untuk memberikan gambaran naratif dan alur bermain kepada calon pemain."
          />
        </div>
      )}

      {/* Konten Langkah 2: Berkas & Platform Target */}
      {currentStep === 2 && (
        <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-base font-bold text-[#171923]">Langkah 2: Berkas Rilis & Dukungan Platform</h2>
            <p className="text-xs text-[#737887]">Pilih format rilis yang didukung dan unggah arsip zip instalasi.</p>
          </div>

          {/* Opsi Platform */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#171923] block">Format Akses Permainan</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => togglePlatform('web')}
                className={`p-4 rounded-[12px] border cursor-pointer flex flex-col justify-between transition-all ${
                  selectedPlatforms.includes('web')
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Globe className="w-5 h-5 text-[#2373FB]" />
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('web')}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  {selectedPlatforms.includes('web') && <Check className="w-4 h-4 text-[#2373FB]" />}
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-[#171923]">WebGL Browser</div>
                  <p className="text-[11px] text-[#737887] mt-0.5">Dapat dimainkan via HTML5/WebGL langsung di situs</p>
                </div>
              </label>

              <label
                onClick={() => togglePlatform('win')}
                className={`p-4 rounded-[12px] border cursor-pointer flex flex-col justify-between transition-all ${
                  selectedPlatforms.includes('win')
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Monitor className="w-5 h-5 text-[#737887]" />
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('win')}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  {selectedPlatforms.includes('win') && <Check className="w-4 h-4 text-[#2373FB]" />}
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-[#171923]">Windows PC</div>
                  <p className="text-[11px] text-[#737887] mt-0.5">Berkas .zip atau .exe mandiri bebas DRM</p>
                </div>
              </label>

              <label
                onClick={() => togglePlatform('apk')}
                className={`p-4 rounded-[12px] border cursor-pointer flex flex-col justify-between transition-all ${
                  selectedPlatforms.includes('apk')
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Smartphone className="w-5 h-5 text-[#737887]" />
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes('apk')}
                    onChange={() => {}}
                    className="sr-only"
                  />
                  {selectedPlatforms.includes('apk') && <Check className="w-4 h-4 text-[#2373FB]" />}
                </div>
                <div className="mt-3">
                  <div className="text-xs font-bold text-[#171923]">Android Mobile</div>
                  <p className="text-[11px] text-[#737887] mt-0.5">Instalasi mandiri berkas .apk (Sideload)</p>
                </div>
              </label>
            </div>
          </div>

          {/* Area Upload Berkas WebGL */}
          {selectedPlatforms.includes('web') && (
            <div className="p-4 bg-[#F7F8FA] rounded-[12px] border border-[#E5E7EB] space-y-3">
              <input
                type="file"
                ref={webFileRef}
                accept=".zip"
                className="hidden"
                onChange={handleSelectWebFile}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-[#2373FB]" />
                  <span className="text-xs font-bold text-[#171923]">Paket WebGL (HTML5 .zip)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => webFileRef.current?.click()}
                  disabled={isWebUploading}
                >
                  {isWebUploading ? 'Mengunggah...' : webUploadProgress >= 100 ? 'Unggah Ulang ZIP' : 'Pilih Berkas ZIP'}
                </Button>
              </div>

              <ProgressBar
                value={webUploadProgress}
                status={webUploadProgress === 100 ? 'success' : 'default'}
                label={`${webFileName} (${webFileSize})`}
                helperText="Arsip harus memuat berkas index.html pada root folder direktori zip."
              />

              <div className="text-[11px] font-mono text-[#737887] bg-white p-2.5 rounded-[8px] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="truncate">SHA-256: {webSha256}</span>
                {webUploadProgress === 100 && (
                  <span className="text-emerald-600 font-sans font-semibold shrink-0">Tersimpan di Cloud</span>
                )}
              </div>
            </div>
          )}

          {/* Area Upload Berkas Windows PC / Android */}
          {(selectedPlatforms.includes('win') || selectedPlatforms.includes('apk')) && (
            <div className="p-4 bg-[#F7F8FA] rounded-[12px] border border-[#E5E7EB] space-y-3">
              <input
                type="file"
                ref={installerFileRef}
                accept=".zip,.exe,.apk,.msi"
                className="hidden"
                onChange={handleSelectInstallerFile}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileArchive className="w-4 h-4 text-[#737887]" />
                  <span className="text-xs font-bold text-[#171923]">Paket Unduhan Standalone (.zip / .exe / .apk)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => installerFileRef.current?.click()}
                  disabled={isInstallerUploading}
                >
                  {isInstallerUploading ? 'Mengunggah ke B2...' : installerUploadProgress >= 100 ? 'Unggah Ulang Berkas' : 'Pilih Berkas Installer'}
                </Button>
              </div>

              <ProgressBar
                value={installerUploadProgress}
                status={installerUploadProgress === 100 ? 'success' : 'default'}
                label={`${installerFileName} (${installerFileSize})`}
                helperText="Berkas instalasi game bebas DRM untuk diunduh langsung oleh pemain."
              />

              <div className="text-[11px] font-mono text-[#737887] bg-white p-2.5 rounded-[8px] border border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="truncate">SHA-256: {installerSha256}</span>
                {installerUploadProgress === 100 && (
                  <span className="text-emerald-600 font-sans font-semibold shrink-0">Tersimpan di Backblaze B2 Vault</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Konten Langkah 3: Media & Etalase */}
      {currentStep === 3 && (
        <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-base font-bold text-[#171923]">Langkah 3: Media Etalase & Tangkapan Layar</h2>
            <p className="text-xs text-[#737887]">Aset visual berkualitas tinggi yang bersih dari watermark pihak ketiga.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Preview Cover Banner 16:9 */}
            <div className="md:col-span-7 space-y-3">
              <label className="text-xs font-semibold text-[#171923] block">
                Cover Banner Utama (Rasio 16:9 • 1920x1080)
              </label>
              <div className="w-full aspect-16/9 rounded-[12px] overflow-hidden bg-[#F0F1F5] border border-[#E5E7EB] relative group">
                <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" size="sm" className="bg-white text-xs">
                    Ganti Gambar Cover
                  </Button>
                </div>
              </div>
              <Input
                label="URL Gambar Cover"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                helperText="Gunakan URL resolusi tinggi atau tautan CDN langsung."
              />
            </div>

            {/* Cuplikan Screenshot Minimal 3 */}
            <div className="md:col-span-5 space-y-3">
              <label className="text-xs font-semibold text-[#171923] block">
                Galeri Cuplikan Gameplay (Minimal 3 Berkas)
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="aspect-16/9 rounded-[8px] overflow-hidden bg-[#F0F1F5] border border-[#E5E7EB]">
                  <img
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"
                    alt="Cuplikan 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-16/9 rounded-[8px] overflow-hidden bg-[#F0F1F5] border border-[#E5E7EB]">
                  <img
                    src="https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=600&auto=format&fit=crop"
                    alt="Cuplikan 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-16/9 rounded-[8px] border-2 border-dashed border-[#D1D5DB] flex flex-col items-center justify-center text-[#737887] hover:border-[#2373FB] cursor-pointer transition">
                  <Upload className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-semibold">+ Tambah Foto</span>
                </div>
              </div>

              <div className="pt-2">
                <Input
                  label="Tautan Video Trailer YouTube (Opsional)"
                  placeholder="https://youtube.com/watch?v=..."
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  helperText="Cuplikan video akan ditampilkan langsung pada galeri detail."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Konten Langkah 4: Harga & Akses */}
      {currentStep === 4 && (
        <div className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
          <div className="border-b border-[#E5E7EB] pb-3">
            <h2 className="text-base font-bold text-[#171923]">Langkah 4: Model Harga & Transparansi Bagi Hasil</h2>
            <p className="text-xs text-[#737887]">Kreator menentukan harga jual. SideLoad hanya mengenakan 2% biaya platform.</p>
          </div>

          {/* Model Harga */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#171923] block">Skema Penetapan Harga</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                onClick={() => setPricingModel('free')}
                className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                  pricingModel === 'free'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-xs text-[#171923]">Akses Gratis (Free)</div>
                <p className="text-[11px] text-[#737887] mt-0.5">Akses publik bebas biaya untuk seluruh pemain.</p>
              </label>

              <label
                onClick={() => setPricingModel('fixed')}
                className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                  pricingModel === 'fixed'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-xs text-[#171923]">Harga Tetap (Premium)</div>
                <p className="text-[11px] text-[#737887] mt-0.5">Pemain membayar nominal tetap untuk lisensi permanen.</p>
              </label>

              <label
                onClick={() => setPricingModel('pwyw')}
                className={`p-4 rounded-[12px] border cursor-pointer transition-all ${
                  pricingModel === 'pwyw'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20'
                    : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-xs text-[#171923]">Bayar Suka-Suka (PWYW)</div>
                <p className="text-[11px] text-[#737887] mt-0.5">Gratis atau bayar donasi sukarela.</p>
              </label>
            </div>
          </div>

          {/* Input Nominal & Kalkulator Live Bagi Hasil */}
          {pricingModel !== 'free' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
              <Input
                label="Nominal Harga Jual (IDR)"
                placeholder="45000"
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
                helperText="Rekomendasi harga karya indie berkisar antara Rp 25.000 hingga Rp 95.000."
              />

              {/* Kotak Kalkulasi Transparan Live */}
              <div className="p-4 bg-[#F7F8FA] rounded-[14px] border border-[#E5E7EB] space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#E5E7EB]">
                  <span className="font-bold text-[#171923]">Simulasi Transaksi Resmi</span>
                  <Badge variant="success" size="sm">Bagi Hasil 98 / 2</Badge>
                </div>

                <div className="flex justify-between text-[#737887]">
                  <span>Harga ke Pemain:</span>
                  <span className="text-[#171923] font-semibold">Rp {numPrice.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex justify-between text-[#737887]">
                  <span>Komisi Pemeliharaan Platform (2%):</span>
                  <span className="text-[#DC2626] font-medium">- Rp {platformFee.toLocaleString('id-ID')}</span>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB] flex justify-between items-center text-sm font-bold">
                  <span className="text-[#171923]">Hak Bersih Studio Anda:</span>
                  <span className="text-base text-[#16A34A]">Rp {netStudio.toLocaleString('id-ID')}</span>
                </div>

                <p className="text-[10px] text-[#737887] pt-1">
                  Tidak ada komisi tersembunyi, biaya API server, atau penalti kuota bandwidth. Studio memegang kendali kepemilikan penuh 100%.
                </p>
              </div>
            </div>
          )}

          {/* Klasifikasi Rating Usia */}
          <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
            <label className="text-xs font-semibold text-[#171923] block">Klasifikasi Konten & Batas Usia</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <label
                onClick={() => setRatingCategory('su')}
                className={`p-3 rounded-[10px] border cursor-pointer ${
                  ratingCategory === 'su' ? 'bg-[#EFF6FF] border-[#2373FB]' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-[#171923]">Semua Umur (SU)</div>
                <div className="text-[11px] text-[#737887] mt-0.5">Bebas kekerasan eksplisit.</div>
              </label>

              <label
                onClick={() => setRatingCategory('r13')}
                className={`p-3 rounded-[10px] border cursor-pointer ${
                  ratingCategory === 'r13' ? 'bg-[#EFF6FF] border-[#2373FB]' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-[#171923]">Remaja (13+)</div>
                <div className="text-[11px] text-[#737887] mt-0.5">Unsur fantasi & aksi ringan.</div>
              </label>

              <label
                onClick={() => setRatingCategory('d18')}
                className={`p-3 rounded-[10px] border cursor-pointer ${
                  ratingCategory === 'd18' ? 'bg-[#EFF6FF] border-[#2373FB]' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <div className="font-bold text-[#171923]">Dewasa (18+)</div>
                <div className="text-[11px] text-[#737887] mt-0.5">Tema psikologis intens.</div>
              </label>
            </div>
          </div>

          {/* Deklarasi Kepatuhan */}
          <div className="space-y-3 pt-3 border-t border-[#E5E7EB]">
            <Checkbox
              id="agree-orig"
              checked={agreeOriginal}
              onChange={(e) => setAgreeOriginal(e.target.checked)}
              label="Orisinalitas & Lisensi Karya"
              description="Saya menyatakan seluruh aset visual, kode sumber, audio, dan elemen game adalah orisinal atau menggunakan lisensi pihak ketiga yang sah secara hukum."
            />

            <Checkbox
              id="agree-safe"
              checked={agreeSafe}
              onChange={(e) => setAgreeSafe(e.target.checked)}
              label="Bebas Perangkat Berbahaya"
              description="Berkas instalasi bebas dari malware, trojan, pelacak tersembunyi, atau cryptocurrency miner apa pun."
            />
          </div>
        </div>
      )}

      {/* Kontrol Navigasi Antar-Langkah */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E5E7EB]">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="md"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            >
              Kembali ke Langkah Sebelumnya
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button
            variant="ghost"
            size="md"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
          >
            Simpan Draf
          </Button>

          {currentStep < 4 ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
            >
              Lanjutkan
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleSubmit(false)}
            >
              Kirim untuk Review Kurator
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
