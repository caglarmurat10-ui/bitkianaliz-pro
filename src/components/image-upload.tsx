"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Camera } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelected: (base64: string) => void;
  isLoading: boolean;
}

export function ImageUpload({ onImageSelected, isLoading }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const processFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Lütfen bir resim dosyası yükleyin.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    processFile(e.dataTransfer.files?.[0]);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => processFile(e.target.files?.[0])}
        disabled={isLoading}
      />
      <input
        type="file"
        ref={cameraRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => processFile(e.target.files?.[0])}
        disabled={isLoading}
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 transition-all",
          preview ? "border-emerald-500 bg-emerald-500/5" : "border-white/15 bg-slate-950/50"
        )}
      >
        {isLoading ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            <p className="text-sm font-medium text-slate-300">Bitki Analiz Ediliyor...</p>
          </div>
        ) : preview ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-sm">
            <Image src={preview} alt="Uploaded plant" fill className="object-cover" unoptimized />
            <button
              onClick={clearImage}
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-6 text-slate-400">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                <Upload className="h-4 w-4" /> Galeri
              </button>
              <button
                type="button"
                onClick={() => cameraRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                <Camera className="h-4 w-4" /> Kamera
              </button>
            </div>
            <p className="max-w-[220px] text-center text-sm opacity-80">
              Bitki fotoğrafını sürükleyin veya kameradan çekin
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
