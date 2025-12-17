"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getTopic,
  getTopicCategories,
  getTopicProducts,
  deleteTopic,
} from "@/lib/actions/topics";
import { getShowcase } from "@/lib/actions/showcases";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import type { ShowcaseTopic, ShowcaseCategory, ShowcaseProduct } from "@prisma/client";

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
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [categoriesEnabled, setCategoriesEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useTelegramBackButton(`/showcase/${showcaseId}`);

  const loadData = useCallback(async () => {
    try {
      const [topicData, showcaseData] = await Promise.all([
        getTopic(topicId),
        getShowcase(showcaseId),
      ]);

      setTopic(topicData);
      setCategoriesEnabled(showcaseData?.categoriesEnabled ?? true);

      if (showcaseData?.categoriesEnabled) {
        const categoriesData = await getTopicCategories(topicId);
        setCategories(categoriesData);
      } else {
        const productsData = await getTopicProducts(topicId);
        setProducts(productsData);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }, [topicId, showcaseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--tg-theme-button-color)] border-t-transparent mx-auto" />
          <p className="mt-3 text-sm text-[var(--tg-theme-hint-color)]">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <p className="text-[var(--tg-theme-hint-color)]">Топик не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">
          {topic.title}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {categoriesEnabled ? (
          // Режим с категориями
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-[var(--tg-theme-hint-color)] uppercase tracking-wide">
                Категории
              </h2>
            </div>

            {categories.length === 0 ? (
              <div className="text-center py-8 bg-[var(--tg-theme-section-bg-color)] rounded-xl">
                <p className="text-[var(--tg-theme-hint-color)] text-sm">
                  Категорий пока нет
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/showcase/${showcaseId}/topic/${topicId}/category/${category.id}`}
                    className="flex items-center gap-3 bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3 active:opacity-70 transition-opacity"
                  >
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
                      {category.subtitle && (
                        <p className="text-xs text-[var(--tg-theme-hint-color)] truncate">
                          {category.subtitle}
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-[var(--tg-theme-hint-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`/showcase/${showcaseId}/topic/${topicId}/category/create`}
              className="flex items-center justify-center gap-2 mt-3 py-3 bg-[var(--tg-theme-button-color)]/10 border border-dashed border-[var(--tg-theme-button-color)] rounded-xl text-[var(--tg-theme-button-color)] font-medium text-sm active:opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить категорию
            </Link>
          </div>
        ) : (
          // Режим без категорий — продукты напрямую
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-[var(--tg-theme-hint-color)] uppercase tracking-wide">
                Продукты
              </h2>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-8 bg-[var(--tg-theme-section-bg-color)] rounded-xl">
                <p className="text-[var(--tg-theme-hint-color)] text-sm">
                  Продуктов пока нет
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/showcase/${showcaseId}/topic/${topicId}/product/${product.id}`}
                    className="flex items-center gap-3 bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3 active:opacity-70 transition-opacity"
                  >
                    {product.icon && (
                      <img
                        src={product.icon}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--tg-theme-text-color)] truncate">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-xs text-[var(--tg-theme-hint-color)] line-clamp-1">
                          {product.description}
                        </p>
                      )}
                    </div>
                    <svg className="w-4 h-4 text-[var(--tg-theme-hint-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}

            <Link
              href={`/showcase/${showcaseId}/topic/${topicId}/product/create`}
              className="flex items-center justify-center gap-2 mt-3 py-3 bg-[var(--tg-theme-button-color)]/10 border border-dashed border-[var(--tg-theme-button-color)] rounded-xl text-[var(--tg-theme-button-color)] font-medium text-sm active:opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Добавить продукт
            </Link>
          </div>
        )}

        {/* Действия */}
        <div className="pt-4 space-y-2">
          <Link
            href={`/showcase/${showcaseId}/topic/${topicId}/edit`}
            className="flex items-center justify-center gap-2 py-3 bg-[var(--tg-theme-section-bg-color)] rounded-xl text-[var(--tg-theme-text-color)] font-medium text-sm active:opacity-70"
          >
            ✏️ Редактировать топик
          </Link>

          <button
            onClick={handleDeleteTopic}
            className="w-full py-3 rounded-xl text-[var(--tg-theme-destructive-text-color)] bg-[var(--tg-theme-destructive-text-color)]/10 font-medium text-sm active:opacity-70"
          >
            Удалить топик
          </button>
        </div>
      </div>
    </div>
  );
}
