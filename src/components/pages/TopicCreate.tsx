"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/lib/actions/showcases";

export default function TopicCreateForm({
  showcaseId,
}: {
  showcaseId: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => router.push(`/showcase/${showcaseId}`));
    });

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await createTopic(showcaseId, title);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Топик успешно создан!");
        router.push(`/showcase/${showcaseId}/topic/${result.topic?.id}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка создания топика");
      }
    } catch (error) {
      console.error("Failed to create topic:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка создания топика");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          Новый топик
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <label className="block text-sm text-[var(--tg-theme-section-header-text-color)] mb-2">
            Название топика *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: Кредиты"
            required
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-4 py-2 rounded-lg border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Создание..." : "Создать топик"}
        </button>
      </form>
    </div>
  );
}
