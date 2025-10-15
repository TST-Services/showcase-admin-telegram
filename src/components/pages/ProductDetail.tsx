"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProduct, deleteProduct } from "@/lib/actions/products";
import type { ShowcaseProduct } from "@prisma/client";

export default function ProductDetailForm({
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
  const [product, setProduct] = useState<ShowcaseProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    try {
      const productData = await getProduct(productId);
      setProduct(productData);
    } catch (error) {
      console.error("Failed to load product:", error);
      import("@twa-dev/sdk").then((module) => {
        module.default.showAlert("Ошибка загрузки продукта");
      });
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(() =>
        router.push(
          `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
        )
      );
    });

    loadProduct();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        module.default.BackButton.hide();
      });
    };
  }, [showcaseId, topicId, categoryId, loadProduct, router]);

  const handleDeleteProduct = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");

    WebApp.showConfirm(
      "Вы уверены, что хотите удалить этот продукт?",
      async (confirmed) => {
        if (confirmed) {
          const result = await deleteProduct(productId);
          if (result.success) {
            WebApp.showAlert("Продукт успешно удалён");
            router.push(
              `/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}`
            );
          } else {
            WebApp.showAlert("Ошибка удаления продукта");
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

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[var(--tg-theme-hint-color)]">Продукт не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          {product.title}
        </h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Product Details */}
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4 mb-6">
          {product.icon && (
            <img
              src={product.icon}
              alt={product.title}
              className="w-20 h-20 object-cover rounded-lg mb-4"
            />
          )}
          <h2 className="text-lg font-semibold text-[var(--tg-theme-text-color)] mb-2">
            {product.title}
          </h2>
          {product.description && (
            <p className="text-[var(--tg-theme-text-color)] mb-4 whitespace-pre-wrap">
              {product.description}
            </p>
          )}
          {product.link && (
            <a
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-lg bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] hover:opacity-90 transition-opacity"
            >
              Перейти по ссылке
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 mb-6">
          <Link
            href={`/showcase/${showcaseId}/topic/${topicId}/category/${categoryId}/product/${productId}/edit`}
            className="block w-full py-3 px-4 rounded-lg bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] text-center font-medium hover:opacity-90 transition-opacity"
          >
            Редактировать продукт
          </Link>
        </div>

        {/* Danger Zone */}
        <div className="bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4">
          <h3 className="text-sm font-medium text-[var(--tg-theme-section-header-text-color)] mb-3">
            Опасная зона
          </h3>
          <button
            onClick={handleDeleteProduct}
            className="w-full py-3 px-4 rounded-lg text-[var(--tg-theme-destructive-text-color)] bg-red-50 hover:bg-red-100 transition-colors font-medium"
          >
            Удалить продукт
          </button>
        </div>
      </div>
    </div>
  );
}
