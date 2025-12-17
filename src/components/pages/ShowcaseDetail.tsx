"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getShowcase, getShowcaseTopics, deleteShowcase } from "@/lib/actions/showcases";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";

interface Showcase {
  id: string;
  name: string;
  uniqueName: string;
  description: string | null;
  template: "BANK" | "SHOP";
  primaryColor: string;
  logoUrl: string;
  categoriesEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Topic {
  id: string;
  title: string;
  priority: number;
  _count?: { categories: number; products: number };
}

export default function ShowcaseDetailPage({ showcaseId }: { showcaseId: string }) {
  const router = useRouter();
  const [showcase, setShowcase] = useState<Showcase | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"topics" | "settings">("topics");
  const [showcaseDomain, setShowcaseDomain] = useState("");

  useTelegramBackButton("/");

  const loadData = useCallback(async () => {
    try {
      const [showcaseData, topicsData] = await Promise.all([
        getShowcase(showcaseId),
        getShowcaseTopics(showcaseId),
      ]);

      setShowcase(showcaseData);
      setTopics(topicsData);

      const response = await fetch("/api/config");
      const config = await response.json();
      setShowcaseDomain(config.showcaseDomain || "");
    } catch (error) {
      console.error("Failed to load data:", error);
      // Не показываем alert — просто логируем ошибку
    } finally {
      setLoading(false);
    }
  }, [showcaseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCopyShowcaseLink = async () => {
    if (!showcase || !showcaseDomain) return;
    const showcaseUrl = `https://${showcaseDomain}/${showcase.uniqueName}`;

    try {
      await navigator.clipboard.writeText(showcaseUrl);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ссылка скопирована!");
    } catch {
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert(`Ссылка: ${showcaseUrl}`);
    }
  };

  const handleDeleteShowcase = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");
    WebApp.showConfirm("Удалить витрину? Это действие нельзя отменить.", async (confirmed) => {
      if (confirmed) {
        const result = await deleteShowcase(showcaseId);
        if (result.success) {
          WebApp.showAlert("Витрина удалена");
          router.push("/");
        } else {
          WebApp.showAlert("Ошибка удаления");
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--tg-theme-button-color)] border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-[var(--tg-theme-hint-color)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!showcase) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <p className="text-[var(--tg-theme-hint-color)]">Витрина не найдена</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] z-10 tg-header-padding">
        <div className="px-4 pb-3 pt-3 border-b border-[var(--tg-theme-secondary-bg-color)]">
          <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)]">
            {showcase.name}
          </h1>
        </div>

        <div className="flex">
          <button
            onClick={() => setActiveTab("topics")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "topics"
                ? "text-[var(--tg-theme-button-color)] border-[var(--tg-theme-button-color)]"
                : "text-[var(--tg-theme-hint-color)] border-transparent"
            }`}
          >
            Контент
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "settings"
                ? "text-[var(--tg-theme-button-color)] border-[var(--tg-theme-button-color)]"
                : "text-[var(--tg-theme-hint-color)] border-transparent"
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
                <p className="text-[var(--tg-theme-hint-color)] text-sm mb-4">Нет топиков</p>
                <Link
                  href={`/showcase/${showcaseId}/topic/create`}
                  className="inline-flex items-center gap-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium py-2.5 px-5 rounded-xl text-sm active:opacity-70"
                >
                  Создать топик
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/showcase/${showcaseId}/topic/${topic.id}`}
                    className="flex items-center justify-between bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3 active:opacity-70"
                  >
                    <div>
                      <h3 className="font-medium text-[var(--tg-theme-text-color)]">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-[var(--tg-theme-hint-color)] mt-0.5">
                        {showcase.categoriesEnabled
                          ? `${topic._count?.categories || 0} категорий`
                          : `${topic._count?.products || 0} продуктов`}
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-[var(--tg-theme-hint-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}

                <Link
                  href={`/showcase/${showcaseId}/topic/create`}
                  className="flex items-center justify-center gap-2 py-3 bg-[var(--tg-theme-button-color)]/10 border border-dashed border-[var(--tg-theme-button-color)] rounded-xl text-[var(--tg-theme-button-color)] font-medium text-sm active:opacity-70"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Добавить топик
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: showcase.primaryColor }}
                >
                  {showcase.logoUrl ? (
                    <img src={showcase.logoUrl} alt={showcase.name} className="w-8 h-8 object-contain" />
                  ) : (
                    <span className="text-white text-xl font-semibold">{showcase.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-[var(--tg-theme-text-color)]">{showcase.name}</h3>
                  <p className="text-xs text-[var(--tg-theme-hint-color)]">@{showcase.uniqueName}</p>
                </div>
              </div>

              {showcase.description && (
                <p className="text-sm text-[var(--tg-theme-text-color)] mb-3">{showcase.description}</p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[var(--tg-theme-bg-color)] rounded-lg p-2.5">
                  <p className="text-[var(--tg-theme-hint-color)]">Шаблон</p>
                  <p className="font-medium text-[var(--tg-theme-text-color)]">
                    {showcase.template === "BANK" ? "Банк" : "Магазин"}
                  </p>
                </div>
                <div className="bg-[var(--tg-theme-bg-color)] rounded-lg p-2.5">
                  <p className="text-[var(--tg-theme-hint-color)]">Структура</p>
                  <p className="font-medium text-[var(--tg-theme-text-color)]">
                    {showcase.categoriesEnabled ? "С категориями" : "Без категорий"}
                  </p>
                </div>
              </div>
            </div>

            {showcaseDomain && (
              <button
                onClick={handleCopyShowcaseLink}
                className="w-full py-3 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium rounded-xl text-sm active:opacity-70"
              >
                📋 Скопировать ссылку
              </button>
            )}

            <Link
              href={`/showcase/${showcaseId}/edit`}
              className="block w-full py-3 bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] text-center font-medium rounded-xl text-sm active:opacity-70"
            >
              ✏️ Редактировать
            </Link>

            <button
              onClick={handleDeleteShowcase}
              className="w-full py-3 bg-[var(--tg-theme-destructive-text-color)]/10 text-[var(--tg-theme-destructive-text-color)] font-medium rounded-xl text-sm active:opacity-70"
            >
              Удалить витрину
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
