"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getShowcase,
  getShowcaseTopics,
  deleteShowcase,
} from "@/lib/actions/showcases";

interface Showcase {
  id: string;
  name: string;
  uniqueName: string;
  description?: string | null;
  template: string;
  primaryColor: string;
  logoUrl: string;
}

interface Topic {
  id: string;
  title: string;
  _count?: { categories: number };
}

export default function ShowcaseDetailPage({
  showcaseId,
}: {
  showcaseId: string;
}) {
  const router = useRouter();
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"topics" | "settings">("topics");

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() => router.push("/"));
    });

    loadData();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, router]);

  const loadData = async () => {
    try {
      const [showcaseData, topicsData] = await Promise.all([
        getShowcase(showcaseId),
        getShowcaseTopics(showcaseId),
      ]);

      setShowcase(showcaseData);
      setTopics(topicsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      import("@twa-dev/sdk").then((module) => {
        module.default.showAlert("Ошибка загрузки данных");
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShowcase = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");

    WebApp.showConfirm(
      "Вы уверены, что хотите удалить эту витрину?",
      async (confirmed) => {
        if (confirmed) {
          const result = await deleteShowcase(showcaseId);
          if (result.success) {
            WebApp.showAlert("Витрина успешно удалена");
            router.push("/");
          } else {
            WebApp.showAlert("Ошибка удаления витрины");
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

  if (!showcase) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--tg-theme-hint-color)]">Витрина не найдена</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] z-10">
        <div className="px-4 py-3">
          <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
            {showcase.name}
          </h1>
        </div>

        <div className="flex border-b border-[var(--tg-theme-secondary-bg-color)]">
          <button
            onClick={() => setActiveTab("topics")}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeTab === "topics"
                ? "text-[var(--tg-theme-button-color)] border-b-2 border-[var(--tg-theme-button-color)]"
                : "text-[var(--tg-theme-hint-color)]"
            }`}
          >
            Контент
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 px-4 py-3 font-medium transition-colors ${
              activeTab === "settings"
                ? "text-[var(--tg-theme-button-color)] border-b-2 border-[var(--tg-theme-button-color)]"
                : "text-[var(--tg-theme-hint-color)]"
            }`}
          >
            Настройки
          </button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "topics" ? (
          <div>
            {topics.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[var(--tg-theme-hint-color)] mb-6">
                  Нет топиков
                </p>
                <Link
                  href={`/showcase/${showcaseId}/topic/create`}
                  className="inline-block bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Создать топик
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/showcase/${showcaseId}/topic/${topic.id}`}
                    className="block bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-[var(--tg-theme-text-color)]">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
                          {topic._count?.categories || 0} категорий
                        </p>
                      </div>
                      <svg
                        className="w-5 h-5 text-[var(--tg-theme-hint-color)]"
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

                <Link
                  href={`/showcase/${showcaseId}/topic/create`}
                  className="block bg-[var(--tg-theme-button-color)]/10 border-2 border-dashed border-[var(--tg-theme-button-color)] rounded-xl p-4"
                >
                  <div className="flex items-center justify-center gap-2 text-[var(--tg-theme-button-color)] font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Добавить топик
                  </div>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: showcase.primaryColor }}
                >
                  {showcase.logoUrl ? (
                    <img
                      src={showcase.logoUrl}
                      alt={showcase.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {showcase.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--tg-theme-text-color)]">
                    {showcase.name}
                  </h3>
                  <p className="text-sm text-[var(--tg-theme-hint-color)]">
                    @{showcase.uniqueName}
                  </p>
                </div>
              </div>

              {showcase.description && (
                <p className="text-sm text-[var(--tg-theme-text-color)] mb-4">
                  {showcase.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-[var(--tg-theme-bg-color)] rounded-lg p-3">
                  <p className="text-[var(--tg-theme-hint-color)]">Шаблон</p>
                  <p className="font-medium text-[var(--tg-theme-text-color)]">
                    {showcase.template === "BANK" ? "Банк" : "Магазин"}
                  </p>
                </div>
                <div className="bg-[var(--tg-theme-bg-color)] rounded-lg p-3">
                  <p className="text-[var(--tg-theme-hint-color)]">Цвет</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: showcase.primaryColor }}
                    />
                    <p className="font-medium text-[var(--tg-theme-text-color)] text-xs">
                      {showcase.primaryColor}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href={`/showcase/${showcaseId}/edit`}
              className="block bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] text-center font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
            >
              Редактировать витрину
            </Link>

            <button
              onClick={handleDeleteShowcase}
              className="w-full bg-[var(--tg-theme-destructive-text-color)]/10 text-[var(--tg-theme-destructive-text-color)] font-semibold py-3 px-6 rounded-xl hover:bg-[var(--tg-theme-destructive-text-color)]/20 transition-colors"
            >
              Удалить витрину
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
