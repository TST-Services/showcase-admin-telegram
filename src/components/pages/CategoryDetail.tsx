"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getCategory,
  getCategoryProducts,
  deleteCategory,
} from "@/lib/actions/categories";
import type { ShowcaseCategory, ShowcaseProduct } from "@prisma/client";

export default function CategoryDetailForm({
  showcaseId,
  topicId,
  categoryId,
}: {
  showcaseId: string;
  topicId: string;
  categoryId: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState<ShowcaseCategory | null>(null);
  const [products, setProducts] = useState<ShowcaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [categoryData, productsData] = await Promise.all([
        getCategory(categoryId),
        getCategoryProducts(categoryId),
      ]);

      setCategory(categoryData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      import("@twa-dev/sdk").then((module) => {
        module.default.showAlert("Ошибка загрузки данных");
      });
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() =>
        router.push(`/showcase/${showcaseId}/topic/${topicId}`)
      );
    });

    loadData();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, loadData, router]);

  const handleDeleteCategory = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");

    WebApp.showConfirm(
      "Вы уверены, что хотите удалить эту категорию?",
      async (confirmed) => {
        if (confirmed) {
          const result = await deleteCategory(categoryId);
          if (result.success) {
            WebApp.showAlert("Категория успешно удалена");
            router.push(`/showcase/${showcaseId}/topic/${topicId}`);
          } else {
            WebApp.showAlert("Ошибка удаления категории");
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

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--tg-theme-hint-color)]">
          Категория не найдена
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <div className="flex items-center gap-3">
          {category.imgUrl && (
            <img
              src={category.imgUrl}
              alt={category.title}
              className="w-8 h-8 object-cover rounded-lg"
            />
          )}
          <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
            {category.title}
          </h1>
        </div>
        {category.description && (
          <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1">
            {category.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Products List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-[var(--tg-theme-text-color)]">
              Продукты
            </h2>
            <Link
              href={`/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/create`}
              className="text-[var(--tg-theme-button-color)] text-sm font-medium"
            >
              + Добавить
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8 bg-[var(--tg-theme-section-bg-color)] rounded-xl">
              <p className="text-[var(--tg-theme-hint-color)]">
                Продуктов пока нет
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${product.id}`}
                  className="block bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-start gap-3">
                    {product.icon && (
                      <img
                        src={product.icon}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--tg-theme-text-color)]">
                        {product.title}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-[var(--tg-theme-hint-color)] mt-1 line-clamp-2">
                          {product.description}
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

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Link
            href={`/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/edit`}
            className="block w-full py-3 px-4 rounded-lg bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] text-center font-medium hover:opacity-90 transition-opacity"
          >
            Редактировать категорию
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <h3 className="text-sm font-medium text-[var(--tg-theme-section-header-text-color)] mb-3">
            Опасная зона
          </h3>
          <button
            onClick={handleDeleteCategory}
            className="w-full py-3 px-4 rounded-lg text-[var(--tg-theme-destructive-text-color)] bg-red-50 hover:bg-red-100 transition-colors font-medium"
          >
            Удалить категорию
          </button>
        </div>
      </div>
    </div>
  );
}
