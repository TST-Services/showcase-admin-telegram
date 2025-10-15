"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/actions/products";
import ImageUpload from "@/components/ui/ImageUpload";

export default function ProductCreateForm({
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
    description: "",
    iconUrl: "",
    buttonUrl: "",
  });
  const [loading, setLoading] = useState(false);

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

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, categoryId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createProduct(categoryId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Продукт успешно создан!");
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
        );
      } else {
        WebApp.showAlert(result.error || "Ошибка создания продукта");
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка создания продукта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          Новый продукт
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
              placeholder="Например: Кредитная карта 120 дней"
              required
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
              rows={4}
              placeholder="Подробное описание продукта"
            />
          </div>

          <ImageUpload
            label="Иконка"
            value={formData.iconUrl}
            onChange={(url) => setFormData({ ...formData, iconUrl: url })}
          />

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Ссылка кнопки
            </label>
            <input
              type="url"
              value={formData.buttonUrl}
              onChange={(e) =>
                setFormData({ ...formData, buttonUrl: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="https://example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Создание..." : "Создать продукт"}
          </button>
        </div>
      </form>
    </div>
  );
}
