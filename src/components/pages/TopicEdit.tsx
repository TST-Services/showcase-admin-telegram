"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTopic, updateTopic } from "@/lib/actions/topics";
import type { ShowcaseTopic } from "@prisma/client";

export default function TopicEditForm({
  showcaseId,
  topicId,
}: {
  showcaseId: string;
  topicId: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadTopic = useCallback(async () => {
    try {
      const topic = await getTopic(topicId);
      if (!topic) {
        throw new Error("Topic not found");
      }
      setTitle(topic.title);
      setPriority(topic.priority);
    } catch (error) {
      console.error("Failed to load topic:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки топика");
    } finally {
      setInitialLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() =>
        router.push(`/showcase/${showcaseId}/topic/${topicId}`)
      );
    });

    loadTopic();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, router, loadTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateTopic(topicId, { title, priority });
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Топик успешно обновлён!");
        router.push(`/showcase/${showcaseId}/topic/${topicId}`);
      } else {
        WebApp.showAlert(result.error || "Ошибка обновления топика");
      }
    } catch (error) {
      console.error("Failed to update topic:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка обновления топика");
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
          Редактировать топик
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="Например: Кредиты"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Приоритет
            </label>
            <input
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-[var(--tg-theme-hint-color)] mt-1">
              Чем выше приоритет, тем выше топик в списке
            </p>
          </div>

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
