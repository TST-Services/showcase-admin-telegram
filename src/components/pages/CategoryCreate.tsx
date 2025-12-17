"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory } from "@/lib/actions/categories";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import ImageUpload from "@/components/ui/ImageUpload";

export default function CategoryCreateForm({
  showcaseId,
  topicId,
}: {
  showcaseId: string;
  topicId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    iconUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useTelegramBackButton(`/showcase/${showcaseId}/topic/${topicId}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createCategory(topicId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Категория создана!");
        router.push(`/showcase/${showcaseId}/topic/${topicId}/category/${result.category?.id}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка создания");
      }
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка создания категории");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">
          Новая категория
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Название *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Кредиты"
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
            placeholder="Краткий подзаголовок"
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
          {loading ? "Создание..." : "Создать категорию"}
        </button>
      </form>
    </div>
  );
}
