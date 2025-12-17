"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTopic, updateTopic } from "@/lib/actions/topics";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";

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

  useTelegramBackButton(`/showcase/${showcaseId}/topic/${topicId}`);

  const loadTopic = useCallback(async () => {
    try {
      const topic = await getTopic(topicId);
      if (!topic) throw new Error("Not found");
      setTitle(topic.title);
      setPriority(topic.priority);
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки");
    } finally {
      setInitialLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    loadTopic();
  }, [loadTopic]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateTopic(topicId, { title, priority });
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Сохранено!");
        router.push(`/showcase/${showcaseId}/topic/${topicId}`);
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
          Редактировать топик
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
        </div>

        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3">
          <label className="block text-xs text-[var(--tg-theme-hint-color)] mb-1.5">Приоритет</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(parseInt(e.target.value) || 0)}
            min="0"
            className="w-full bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)] px-3 py-2 rounded-lg text-sm focus:outline-none"
          />
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
