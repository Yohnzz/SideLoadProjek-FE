import React, { useState } from 'react'
import { CreditCard, X, ShieldCheck } from 'lucide-react'
import type { BankAccount } from '../types/game'

interface BankSetupModalProps {
  isOpen: boolean
  onClose: () => void
  currentBank?: BankAccount
  onSave: (bank: BankAccount) => void
}

export const BankSetupModal: React.FC<BankSetupModalProps> = ({
  isOpen,
  onClose,
  currentBank,
  onSave
}) => {
  const [bankName, setBankName] = useState(currentBank?.bankName || 'Bank Central Asia (BCA)')
  const [accountNumber, setAccountNumber] = useState(currentBank?.accountNumber || '')
  const [accountHolder, setAccountHolder] = useState(currentBank?.accountHolder || '')
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accountNumber || !accountHolder) {
      alert('Harap isi nomor rekening dan nama pemilik rekening secara lengkap.')
      return
    }
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      onSave({
        bankName,
        accountNumber,
        accountHolder,
        isVerified: true
      })
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-[#222629]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#F4F4F2] rounded-2xl max-w-md w-full border border-[#BBBFCA] p-6 shadow-2xl relative space-y-5">
        
        {/* Header Modal */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#495464] text-[#F4F4F2] flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#222629]">
                Konfigurasi Rekening Bank
              </h3>
              <p className="text-xs text-[#495464]">
                Diperlukan untuk penyaluran 90% royalti penjualan.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-[#495464] hover:text-[#222629] p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Input Rekening */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-[#222629] block">Pilihan Bank Penerima *</label>
            <select
              value={bankName}
              onChange={e => setBankName(e.target.value)}
              className="w-full bg-[#E8E8E8] text-[#222629] px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none"
            >
              <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
              <option value="Bank Mandiri">Bank Mandiri</option>
              <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
              <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
              <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#222629] block">Nomor Rekening *</label>
            <input
              type="text"
              required
              placeholder="Contoh: 8270193312"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              className="w-full bg-[#E8E8E8] text-[#222629] px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[#222629] block">Nama Pemilik Rekening *</label>
            <input
              type="text"
              required
              placeholder="Sesuai nama yang tertera di buku tabungan"
              value={accountHolder}
              onChange={e => setAccountHolder(e.target.value)}
              className="w-full bg-[#E8E8E8] text-[#222629] px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none"
            />
          </div>

          <div className="p-3 bg-[#E8E8E8] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2 text-[11px] text-[#495464]">
            <ShieldCheck className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
            <span>
              Data rekening dilindungi enkripsi standar perbankan. Pencairan dana otomatis ditransfer tanpa potongan biaya transfer admin.
            </span>
          </div>

          {/* Tombol Simpan */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#F4F4F2] text-[#495464] hover:text-[#222629] border border-[#BBBFCA] rounded-lg font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#495464] text-[#F4F4F2] hover:bg-[#3d4654] rounded-lg font-semibold shadow-xs transition"
            >
              {isSaving ? 'Memverifikasi...' : 'Simpan Rekening Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
