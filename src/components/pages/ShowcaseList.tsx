"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getShowcases } from "@/lib/actions/showcases";
import type { Showcase } from "@prisma/client";

export default function ShowcaseList() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  const loadShowcases = useCallback(async () => {
    try {
      const data = await getShowcases();
      setShowcases(data);
    } catch (error) {
      console.error("Failed to load showcases:", error);
      // Показываем alert только если SDK загружен
      import("@twa-dev/sdk").then((module) => {
        module.default.showAlert("Ошибка загрузки витрин");
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Динамический импорт SDK
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      WebApp.BackButton.hide();
    });

    loadShowcases();
  }, [loadShowcases]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto"></div>
          <p className="mt-4 text-[var(--tg-theme-hint-color)]">
            Загрузка витрин...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--tg-theme-header-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 py-3 z-10">
        <h1 className="text-xl font-semibold text-[var(--tg-theme-text-color)]">
          Мои витрины
        </h1>
      </div>

      {/* Content */}
      <div className="p-4">
        {showcases.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-[var(--tg-theme-hint-color)] mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-[var(--tg-theme-hint-color)] mb-6">
              У вас пока нет витрин
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {showcases.map((showcase) => (
              <Link
                key={showcase.id}
                href={`/showcase/${showcase.id}`}
                className="block bg-[var(--tg-theme-section-bg-color)] rounded-xl p-4 hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: showcase.primaryColor }}
                  >
                    {showcase.logoUrl ? (
                      <img
                        src={showcase.logoUrl}
                        alt={showcase.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {showcase.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--tg-theme-text-color)] truncate">
                      {showcase.name}
                    </h3>
                    <p className="text-sm text-[var(--tg-theme-hint-color)] truncate">
                      @{showcase.uniqueName}
                    </p>
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

      {/* Floating Action Button */}
      <Link
        href="/showcase/create"
        className="fixed right-6 w-14 h-14 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ bottom: "calc(1.5rem + var(--tg-safe-area-inset-bottom))" }}
      >
        <svg
          className="w-6 h-6"
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
      </Link>
    </div>
  );
}
