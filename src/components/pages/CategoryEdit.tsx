"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCategory, updateCategory } from "@/lib/actions/categories";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CategoryEditForm({
  showcaseId,
  topicId,
  categoryId,
}: {
  showcaseId: string;
  topicId: string;
  categoryId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    iconUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const detailPath = `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`;
  useTelegramBackButton(detailPath);

  const loadCategory = useCallback(async () => {
    try {
      const category = await getCategory(categoryId);
      if (!category) throw new Error("Not found");
      setFormData({
        title: category.title,
        subtitle: category.subtitle || "",
        description: category.description || "",
        iconUrl: category.imgUrl || "",
      });
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки");
    } finally {
      setInitialLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadCategory();
  }, [loadCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateCategory(categoryId, formData);
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
          Редактировать категорию
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
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Подзаголовок</label>
          <input
            type="text"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
          />
        </div>

        <ImageUpload
          label="Иконка"
          value={formData.iconUrl}
          onChange={(url) => setFormData({ ...formData, iconUrl: url })}
        />

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
