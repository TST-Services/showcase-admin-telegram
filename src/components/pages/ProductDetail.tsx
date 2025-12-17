"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct, deleteProduct } from "@/lib/actions/products";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import type { ShowcaseProduct } from "@prisma/client";

export default function ProductDetailForm({
  showcaseId,
  topicId,
  categoryId,
  productId,
}: {
  showcaseId: string;
  topicId: string;
  categoryId?: string;
  productId: string;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<ShowcaseProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const backPath = categoryId
    ? `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
    : `/showcase/${showcaseId}/topic/${topicId}`;

  useTelegramBackButton(backPath);

  const loadProduct = useCallback(async () => {
    try {
      const data = await getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error("Failed to load product:", error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleDelete = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");
    WebApp.showConfirm("Удалить продукт?", async (confirmed) => {
      if (confirmed) {
        const result = await deleteProduct(productId);
        if (result.success) {
          WebApp.showAlert("Удалено");
          router.push(backPath);
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
        <p className="text-[var(--tg-theme-hint-color)]">Продукт не найден</p>
      </div>
    );
  }

  const editPath = categoryId
    ? `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${productId}/edit`
    : `/showcase/${showcaseId}/topic/${topicId}/product/${productId}/edit`;

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">{product.title}</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          {product.icon && (
            <img src={product.icon} alt={product.title} className="w-16 h-16 rounded-xl object-cover mb-3" />
          )}
          <h2 className="font-medium text-[var(--tg-theme-text-color)]">{product.title}</h2>
          {product.description && (
            <p className="text-sm text-[var(--tg-theme-text-color)] mt-2 whitespace-pre-wrap">{product.description}</p>
          )}
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 px-4 py-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-lg text-sm font-medium"
            >
              Перейти →
            </a>
          )}
        </div>

        <div className="space-y-2">
          <Link
            href={editPath}
            className="flex items-center justify-center gap-2 py-3 bg-[var(--tg-theme-section-bg-color)] rounded-xl text-[var(--tg-theme-text-color)] font-medium text-sm active:opacity-70"
          >
            ✏️ Редактировать
          </Link>

          <button
            onClick={handleDelete}
            className="w-full py-3 rounded-xl text-[var(--tg-theme-destructive-text-color)] bg-[var(--tg-theme-destructive-text-color)]/10 font-medium text-sm active:opacity-70"
          >
            Удалить продукт
          </button>
        </div>
      </div>
    </div>
  );
}
