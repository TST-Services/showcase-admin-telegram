"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/lib/actions/products";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import ImageUpload from "@/components/ui/ImageUpload";

export default function ProductEditForm({
  showcaseId,
  topicId,
  categoryId,
  productId,
}: {
  showcaseId: string;
  topicId: string;
  categoryId?: string;
  productId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconUrl: "",
    buttonUrl: "",
    backgroundColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const detailPath = categoryId
    ? `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${productId}`
    : `/showcase/${showcaseId}/topic/${topicId}/product/${productId}`;

  useTelegramBackButton(detailPath);

  const loadProduct = useCallback(async () => {
    try {
      const product = await getProduct(productId);
      if (!product) throw new Error("Not found");
      setFormData({
        title: product.title,
        description: product.description || "",
        iconUrl: product.icon || "",
        buttonUrl: product.link || "",
        backgroundColor: product.backgroundColor || "",
      });
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки");
    } finally {
      setInitialLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProduct(productId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Сохранено!");
        router.push(detailPath);
      } else {
        WebApp.showAlert(result.error || "Ошибка сохранения");
      }
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка сохранения");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--tg-theme-button-color)] border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-[var(--tg-theme-hint-color)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">
          Редактировать продукт
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
          />
        </div>

        <ImageUpload
          label="Иконка"
          value={formData.iconUrl}
          onChange={(url) => setFormData({ ...formData, iconUrl: url })}
        />

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Ссылка</label>
          <input
            type="url"
            value={formData.buttonUrl}
            onChange={(e) => setFormData({ ...formData, buttonUrl: e.target.value })}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-2">Цвет фона</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formData.backgroundColor || "#ffffff"}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={formData.backgroundColor}
              onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
              placeholder="#ffffff"
              className="flex-1 bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
            />
            {formData.backgroundColor && (
              <button
                type="button"
                onClick={() => setFormData({ ...formData, backgroundColor: "" })}
                className="text-[var(--tg-theme-hint-color)] text-xs"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium py-3 rounded-xl text-sm active:opacity-70 disabled:opacity-50"
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
