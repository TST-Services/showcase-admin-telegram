"use client";

import { useState, useRef } from "react";
import { ImageUploadService } from "@/lib/services/imgbb";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  required?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  required = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Показываем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем на ImgBB
    setUploading(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      if (!apiKey) {
        alert("IMGBB_API_KEY не настроен");
        return;
      }

      const uploadService = new ImageUploadService(apiKey);
      const result = await uploadService.uploadImage(file);

      if (result.success && result.url) {
        onChange(result.url);
      } else {
        alert(result.error || "Ошибка загрузки изображения");
        setPreview(value);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Ошибка загрузки изображения");
      setPreview(value);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
      <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
        {label} {required && "*"}
      </label>

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full h-40 bg-[var(--tg-theme-bg-color)] rounded-lg overflow-hidden border border-[var(--tg-theme-secondary-bg-color)]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex-1 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {uploading ? "Загрузка..." : "Изменить"}
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={uploading}
              className="flex-1 bg-[var(--tg-theme-destructive-text-color)]/10 text-[var(--tg-theme-destructive-text-color)] font-semibold py-2 px-4 rounded-lg hover:bg-[var(--tg-theme-destructive-text-color)]/20 transition-colors disabled:opacity-50"
            >
              Удалить
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full border-2 border-dashed border-[var(--tg-theme-secondary-bg-color)] rounded-lg p-8 hover:border-[var(--tg-theme-button-color)] transition-colors disabled:opacity-50"
        >
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-[var(--tg-theme-hint-color)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-[var(--tg-theme-hint-color)]">
              {uploading ? "Загрузка..." : "Нажмите для загрузки изображения"}
            </p>
            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
              PNG, JPG, GIF до 32MB
            </p>
          </div>
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
