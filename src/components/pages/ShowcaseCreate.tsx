"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createShowcase } from "@/lib/actions/showcases";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
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
    categoriesEnabled: true,
  });
  const [loading, setLoading] = useState(false);

  useTelegramBackButton("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createShowcase(formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Витрина создана!");
        router.push(`/showcase/${result.showcase?.id}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка создания");
      }
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка создания витрины");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">
          Новая витрина
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">
            Название *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Мой Банк"
            required
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">
            Уникальное имя *
          </label>
          <input
            type="text"
            value={formData.uniqueName}
            onChange={(e) => setFormData({ ...formData, uniqueName: e.target.value.toLowerCase() })}
            placeholder="my-bank"
            required
            pattern="[a-z0-9-]+"
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
          <p className="text-[10px] text-[var(--tg-theme-hint-color)] mt-1">
            Латинские буквы, цифры и дефис
          </p>
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">
            Описание
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Краткое описание"
            rows={2}
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none resize-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-2">
            Шаблон
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["BANK", "SHOP"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData({ ...formData, template: t })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  formData.template === t
                    ? "border-[var(--tg-theme-button-color)] bg-[var(--tg-theme-button-color)]/10"
                    : "border-transparent bg-[var(--tg-theme-bg-color)]"
                }`}
              >
                <span className="text-xl">{t === "BANK" ? "🏦" : "🛍️"}</span>
                <p className="text-xs font-medium text-[var(--tg-theme-text-color)] mt-1">
                  {t === "BANK" ? "Банк" : "Магазин"}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-2">
            Основной цвет
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-0"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="flex-1 bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
            />
          </div>
        </div>

        <ImageUpload
          label="Логотип"
          value={formData.logoUrl}
          onChange={(url) => setFormData({ ...formData, logoUrl: url })}
        />

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <div
            onClick={() => setFormData({ ...formData, categoriesEnabled: !formData.categoriesEnabled })}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <p className="text-sm font-medium text-[var(--tg-theme-text-color)]">
                Использовать категории
              </p>
              <p className="text-[10px] text-[var(--tg-theme-hint-color)] mt-0.5">
                {formData.categoriesEnabled ? "Топики → Категории → Продукты" : "Топики → Продукты"}
              </p>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors relative ${
              formData.categoriesEnabled ? "bg-[var(--tg-theme-button-color)]" : "bg-[var(--tg-theme-secondary-bg-color)]"
            }`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                formData.categoriesEnabled ? "right-0.5" : "left-0.5"
              }`} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium py-3 rounded-xl text-sm active:opacity-70 disabled:opacity-50"
        >
          {loading ? "Создание..." : "Создать витрину"}
        </button>
      </form>
    </div>
  );
}
