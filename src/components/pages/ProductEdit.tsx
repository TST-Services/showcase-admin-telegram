"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProduct, updateProduct } from "@/lib/actions/products";
import ImageUpload from "@/components/ui/ImageUpload";
import type { ShowcaseProduct } from "@prisma/client";

export default function ProductEditForm({
  showcaseId,
  topicId,
  categoryId,
  productId,
}: {
  showcaseId: string;
  topicId: string;
  categoryId: string;
  productId: string;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    iconUrl: "",
    buttonUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    try {
      const product = await getProduct(productId);
      if (!product) {
        throw new Error("Product not found");
      }
      setFormData({
        title: product.title,
        description: product.description || "",
        iconUrl: product.icon || "",
        buttonUrl: product.link || "",
      });
    } catch (error) {
      console.error("Failed to load product:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка загрузки продукта");
    } finally {
      setInitialLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() =>
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${productId}`
        )
      );
    });

    loadProduct();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, categoryId, productId, router, loadProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await updateProduct(productId, formData);
      const { default: WebApp } = await import("@twa-dev/sdk");

      if (result.success) {
        WebApp.showAlert("Продукт успешно обновлён!");
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${productId}`
        );
      } else {
        WebApp.showAlert(result.error || "Ошибка обновления продукта");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("Ошибка обновления продукта");
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
          Редактировать продукт
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
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="Например: Кредитная карта 120 дней"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Описание
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)] resize-none"
              rows={4}
              placeholder="Подробное описание продукта"
            />
          </div>

          <ImageUpload
            label="Иконка"
            value={formData.iconUrl}
            onChange={(url) => setFormData({ ...formData, iconUrl: url })}
          />

          <div>
            <label className="block text-sm font-medium text-[var(--tg-theme-hint-color)] mb-2">
              Ссылка
            </label>
            <input
              type="url"
              value={formData.buttonUrl}
              onChange={(e) =>
                setFormData({ ...formData, buttonUrl: e.target.value })
              }
              className="w-full px-4 py-3 rounded-lg bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] border border-[var(--tg-theme-secondary-bg-color)] focus:outline-none focus:border-[var(--tg-theme-button-color)]"
              placeholder="https://example.com"
            />
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
