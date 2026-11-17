import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal, Input, Select, Button } from './ui';
import type { BankAccount } from '../types/game';

interface BankSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBank?: BankAccount;
  onSave: (bank: BankAccount) => void;
}

export const BankSetupModal: React.FC<BankSetupModalProps> = ({
  isOpen,
  onClose,
  currentBank,
  onSave,
}) => {
  const [bankName, setBankName] = useState(currentBank?.bankName || 'Bank Central Asia (BCA)');
  const [accountNumber, setAccountNumber] = useState(currentBank?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(currentBank?.accountHolder || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber || !accountHolder) {
      alert('Harap isi nomor rekening dan nama pemilik rekening secara lengkap.');
      return;
    }
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave({
        bankName,
        accountNumber,
        accountHolder,
        isVerified: true,
      });
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfigurasi Rekening Bank Penerima"
      description="Diperlukan untuk penyaluran 98% royalti bersih penjualan game Anda."
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSaving}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isSaving}
            onClick={handleSubmit}
          >
            Simpan & Verifikasi Rekening
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Bank Penerima"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          options={[
            { value: 'Bank Central Asia (BCA)', label: 'Bank Central Asia (BCA)' },
            { value: 'Bank Mandiri', label: 'Bank Mandiri' },
            { value: 'Bank Rakyat Indonesia (BRI)', label: 'Bank Rakyat Indonesia (BRI)' },
            { value: 'Bank Negara Indonesia (BNI)', label: 'Bank Negara Indonesia (BNI)' },
            { value: 'Bank Syariah Indonesia (BSI)', label: 'Bank Syariah Indonesia (BSI)' },
            { value: 'Bank Jago', label: 'Bank Jago (Digital)' },
            { value: 'SeaBank Indonesia', label: 'SeaBank Indonesia' },
          ]}
        />

        <Input
          label="Nomor Rekening Bank"
          placeholder="Contoh: 827-019-3312"
          required
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          helperText="Pastikan nomor rekening tepat dan aktif untuk proses pencairan dana."
        />

        <Input
          label="Nama Lengkap Pemilik Rekening"
          placeholder="Contoh: Bagas Pratama / Nusantara Horizon Studio"
          required
          value={accountHolder}
          onChange={(e) => setAccountHolder(e.target.value)}
          helperText="Harus sesuai dengan nama yang tertera pada buku tabungan atau mutasi bank."
        />

        <div className="p-3 bg-[#F0F1F5] rounded-[10px] flex items-start gap-2 text-xs text-[#737887]">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
          <span>
            Pencairan otomatis diproses setiap hari kerja tanpa potongan biaya admin transfer ke seluruh bank nasional.
          </span>
        </div>
      </form>
    </Modal>
  );
};
