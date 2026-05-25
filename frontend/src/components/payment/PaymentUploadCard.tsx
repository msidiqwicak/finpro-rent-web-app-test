import React, { useRef, useState } from "react";

interface PaymentUploadCardProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export default function PaymentUploadCard({
  file,
  onFileSelect,
}: PaymentUploadCardProps) {
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setFileError("");
    if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
      setFileError("Format tidak valid. Harap unggah file JPG atau PNG.");
      return;
    }
    if (selectedFile.size > 1048576) {
      setFileError("Ukuran file terlalu besar. Maksimal 1MB.");
      return;
    }
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length > 0)
      validateAndSetFile(e.dataTransfer.files[0]);
  };

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/50">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-primary-fixed text-on-primary-fixed p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-xl">upload_file</span>
        </div>
        <h2 className="font-headline-sm text-xl text-primary">
          Upload Payment Proof
        </h2>
      </div>
      <p className="font-body-md text-on-surface-variant mb-6 text-sm">
        Please upload a screenshot or photo of your transfer receipt.
      </p>

      {!file && (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
            isDragging
              ? "border-primary bg-primary-fixed/20"
              : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
          }`}
        >
          <span
            className={`material-symbols-outlined text-4xl mb-3 ${isDragging ? "text-primary" : "text-on-surface-variant"}`}
          >
            cloud_upload
          </span>
          <p className="font-label-md text-sm text-primary mb-1">
            Click to upload or drag and drop
          </p>
          <p className="font-caption text-xs text-on-surface-variant">
            Supported formats: JPG, PNG. Maximum size: 1MB.
          </p>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files?.length) validateAndSetFile(e.target.files[0]);
            }}
          />
        </div>
      )}

      {fileError && (
        <div className="mt-4 bg-red-50 text-red-600 rounded-lg p-3 flex items-start gap-2 text-sm border border-red-100">
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{fileError}</span>
        </div>
      )}

      {file && (
        <div className="mt-4 bg-primary-fixed/30 border border-primary-fixed text-primary rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
            <span className="font-body-md text-sm font-medium truncate max-w-[200px]">
              {file.name}
            </span>
          </div>
          <button
            onClick={() => onFileSelect(null)}
            className="text-on-surface-variant hover:text-red-500 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
      )}
    </section>
  );
}
