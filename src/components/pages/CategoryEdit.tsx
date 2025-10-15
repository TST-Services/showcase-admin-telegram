"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCategory, updateCategory } from "@/lib/actions/categories";
import ImageUpload from "@/components/ui/ImageUpload";
import type { ShowcaseCategory } from "@prisma/client";

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

  const loadCategory = useCallback(async () => {
    try {
      const category = await getCategory(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
      setFormData({
        title: category.title,
        subtitle: category.subtitle || "",
        description: category.description || "",
        iconUrl: category.imgUrl || "",
      });
    } catch (error) {
      console.error("Failed to load category:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки категории");
    } finally {
      setInitialLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() =>
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
        )
      );
    });

    loadCategory();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, categoryId, router, loadCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateCategory(categoryId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Категория успешно обновлена!");
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
        );
      } else {
        WebApp.showAlert(result.error || "Ошибка обновления категории");
      }
    } catch (error) {
      console.error("Failed to update category:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка обновления категории");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto"></div>
          <p className="mt-4 text-[var(--tg-theme-hint-color)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          Редактировать категорию
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Название
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="Например: Кредиты"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Подзаголовок
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="Краткий подзаголовок"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)] resize-none"
              rows={3}
              placeholder="Краткое описание категории"
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
            className="w-full py-3 px-4 rounded-lg bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Сохранение..." : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
}
