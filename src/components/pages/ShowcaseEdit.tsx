"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getShowcase, updateShowcase } from "@/lib/actions/showcases";
import ImageUpload from "@/components/ui/ImageUpload";
import type { Showcase } from "@prisma/client";

export default function ShowcaseEditForm({
  showcaseId,
}: {
  showcaseId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    uniqueName: "",
    description: "",
    template: "BANK" as "BANK" | "SHOP",
    primaryColor: "#2481cc",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadShowcase = useCallback(async () => {
    try {
      const showcase = await getShowcase(showcaseId);
      if (!showcase) {
        throw new Error("Showcase not found");
      }
      setFormData({
        name: showcase.name,
        uniqueName: showcase.uniqueName,
        description: showcase.description || "",
        template: showcase.template,
        primaryColor: showcase.primaryColor,
        logoUrl: showcase.logoUrl,
      });
    } catch (error) {
      console.error("Failed to load showcase:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки витрины");
    } finally {
      setInitialLoading(false);
    }
  }, [showcaseId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => router.push(`/showcase/${showcaseId}`));
    });

    loadShowcase();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, router, loadShowcase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateShowcase(showcaseId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Витрина успешно обновлена!");
        router.push(`/showcase/${showcaseId}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка обновления витрины");
      }
    } catch (error) {
      console.error("Failed to update showcase:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка обновления витрины");
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
          Редактировать витрину
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
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="Например: Мой Банк"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Уникальное имя
            </label>
            <input
              type="text"
              value={formData.uniqueName}
              onChange={(e) =>
                setFormData({ ...formData, uniqueName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="my-bank"
              pattern="[a-z0-9-]+"
              title="Только строчные буквы, цифры и дефис"
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
              rows={3}
              placeholder="Краткое описание витрины"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Шаблон
            </label>
            <select
              value={formData.template}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  template: e.target.value as "BANK" | "SHOP",
                })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
            >
              <option value="BANK">Банк</option>
              <option value="SHOP">Магазин</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Основной цвет
            </label>
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              className="w-full h-12 rounded-lg bg-[var(--tg-theme-section-bg-color)] border border-[var(--tg-theme-secondary-bg-color)] cursor-pointer"
            />
          </div>

          <ImageUpload
            label="Логотип"
            value={formData.logoUrl}
            onChange={(url) => setFormData({ ...formData, logoUrl: url })}
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
