"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createShowcase } from "@/lib/actions/showcases";
import ImageUpload from "@/components/ui/ImageUpload";

export default function ShowcaseCreateForm() {
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

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => router.push("/"));
    });

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createShowcase(formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Витрина успешно создана!");
        router.push(`/showcase/${result.showcase?.id}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка создания витрины");
      }
    } catch (error) {
      console.error("Failed to create showcase:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка создания витрины");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          Новая витрина
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Название витрины *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Например: Мой Банк"
            required
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-4 py-2 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Уникальное имя *
          </label>
          <input
            type="text"
            value={formData.uniqueName}
            onChange={(e) =>
              setFormData({
                ...formData,
                uniqueName: e.target.value.toLowerCase(),
              })
            }
            placeholder="my-bank"
            required
            pattern="[a-z0-9-]+"
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-4 py-2 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
          />
          <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
            Только латинские буквы, цифры и дефис
          </p>
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Краткое описание витрины"
            rows={3}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-4 py-2 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)] resize-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Шаблон витрины
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, template: "BANK" })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.template === "BANK"
                  ? "border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-button-color)]/10"
                  : "border-[var(--tg-theme-secondary-bg-color)]"
              }`}
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-[var(--tg-theme-text-color)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="text-sm font-medium text-[var(--tg-theme-text-color)]">
                  Банк
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, template: "SHOP" })}
              className={`p-4 rounded-lg border-2 transition-colors ${
                formData.template === "SHOP"
                  ? "border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-button-color)]/10"
                  : "border-[var(--tg-theme-secondary-bg-color)]"
              }`}
            >
              <div className="text-center">
                <svg
                  className="w-8 h-8 mx-auto mb-2 text-[var(--tg-theme-text-color)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="text-sm font-medium text-[var(--tg-theme-text-color)]">
                  Магазин
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Основной цвет
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              className="w-16 h-16 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) =>
                setFormData({ ...formData, primaryColor: e.target.value })
              }
              placeholder="#2481cc"
              pattern="^#[0-9A-Fa-f]{6}$"
              className="flex-1 bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-4 py-2 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
            />
          </div>
        </div>

        <ImageUpload
          label="Логотип"
          value={formData.logoUrl}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Создание..." : "Создать витрину"}
        </button>
      </form>
    </div>
  );
}
