import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axiosConfig";
import BankDetailsCard from "./BankDetailsCard";
import PaymentUploadCard from "./PaymentUploadCard";

interface ManualTransferProps {
  orderId: string;
  amount: number;
}

export default function ManualTransfer({
  orderId,
  amount,
}: ManualTransferProps) {
  // State disimpan di sini (sebagai "otak")
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleManualSubmit = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      // Siapkan data untuk dikirim ke backend
      const formData = new FormData();
      formData.append("bookingId", orderId);
      formData.append("amount", amount.toString());
      formData.append("method", "MANUAL_TRANSFER");
      formData.append("paymentProof", file); // Nama field ini harus sesuai dengan multer di backend

      // Tembak API Upload
      await api.post("/payments/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Bukti pembayaran berhasil diunggah!");
      navigate("/bookings"); // Arahkan kembali ke halaman daftar pesanan
    } catch (error: any) {
      console.error("Gagal upload:", error);
      alert(
        error.response?.data?.error || "Gagal mengunggah bukti pembayaran.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30">
      {/* 1. Komponen Info Bank */}
      <BankDetailsCard />

      <div className="border-t border-surface-variant pt-6">
        {/* 2. Komponen UI Upload (Menggunakan props yang benar) */}
        <PaymentUploadCard
          file={file}
          onFileSelect={(selectedFile) => setFile(selectedFile)}
        />
      </div>

      {/* 3. Tombol Eksekusi Upload */}
      <button
        onClick={handleManualSubmit}
        disabled={!file || isUploading}
        className="w-full py-4 rounded-xl font-bold bg-secondary-container text-on-secondary-container hover:opacity-90 disabled:opacity-50 cursor-pointer border-none flex items-center justify-center gap-2 transition-colors"
      >
        {isUploading && (
          <span className="material-symbols-outlined animate-spin text-[18px]">
            autorenew
          </span>
        )}
        {isUploading ? "Uploading..." : "Submit Manual Proof"}
      </button>
    </div>
  );
}
