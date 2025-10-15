"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTopic,
  getTopicCategories,
  deleteTopic,
} from "@/lib/actions/topics";
import type { ShowcaseTopic, ShowcaseCategory } from "@prisma/client";

export default function TopicDetailForm({
  showcaseId,
  topicId,
}: {
  showcaseId: string;
  topicId: string;
}) {
  const router = useRouter();
  const [topic, setTopic] = useState<ShowcaseTopic | null>(null);
  const [categories, setCategories] = useState<ShowcaseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      console.log("Loading data for topic:", topicId);

      const topicData = await getTopic(topicId);
      console.log("Topic loaded:", topicData);
      setTopic(topicData);

      const categoriesData = await getTopicCategories(topicId);
      console.log("Categories loaded:", categoriesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      import("@twa-dev/sdk").then((module) => {
        module.default.showAlert(
          `Ошибка загрузки данных: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      });
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => router.push(`/showcase/${showcaseId}`));
    });

    loadData();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, loadData, router]);

  const handleDeleteTopic = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");

    WebApp.showConfirm(
      "Вы уверены, что хотите удалить этот топик?",
      async (confirmed) => {
        if (confirmed) {
          const result = await deleteTopic(topicId);
          if (result.success) {
            WebApp.showAlert("Топик успешно удалён");
            router.push(`/showcase/${showcaseId}`);
          } else {
            WebApp.showAlert("Ошибка удаления топика");
          }
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto"></div>
          <p className="mt-4 text-[var(--tg-theme-hint-color)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--tg-theme-hint-color)]">Топик не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          {topic.title}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Categories List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[var(--tg-theme-text-color)]">
              Категории
            </h2>
            <Link
              href={`/showcase/${showcaseId}/topic/${topicId}/category/create`}
              className="text-[var(--tg-theme-button-color)] text-sm font-medium"
            >
              + Добавить
            </Link>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 bg-[var(--tg-theme-section-bg-color)] rounded-xl">
              <p className="text-[var(--tg-theme-hint-color)]">
                Категорий пока нет
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/showcase/${showcaseId}/topic/${topicId}/category/${category.id}`}
                  className="block bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    {category.imgUrl && (
                      <img
                        src={category.imgUrl}
                        alt={category.title}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--tg-theme-text-color)] truncate">
                        {category.title}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-[var(--tg-theme-hint-color)] truncate">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <svg
                      className="w-5 h-5 text-[var(--tg-theme-hint-color)] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <h3 className="text-sm font-medium text-[var(--tg-theme-section-header-text-color)] mb-3">
            Опасная зона
          </h3>
          <button
            onClick={handleDeleteTopic}
            className="w-full py-3 px-4 rounded-lg text-[var(--tg-theme-destructive-text-color)] bg-red-50 hover:bg-red-100 transition-colors font-medium"
          >
            Удалить топик
          </button>
        </div>
      </div>
    </div>
  );
}
