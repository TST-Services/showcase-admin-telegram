"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getShowcases } from "@/lib/actions/showcases";
import { useTelegramBackButton } from "@/lib/hooks/useTelegramBackButton";
import type { Showcase } from "@prisma/client";

export default function ShowcaseList() {
  const [showcases, setShowcases] = useState<Showcase[]>([]);
  const [loading, setLoading] = useState(true);

  useTelegramBackButton(null); // Скрываем кнопку назад на главной

  const loadShowcases = useCallback(async () => {
    try {
      const data = await getShowcases();
      setShowcases(data);
    } catch (error) {
      console.error("Failed to load showcases:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShowcases();
  }, [loadShowcases]);

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

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="sticky top-0 bg-[var(--tg-theme-bg-color)] border-b border-[var(--tg-theme-secondary-bg-color)] px-4 pb-3 z-10 tg-header-padding">
        <h1 className="text-lg font-semibold text-[var(--tg-theme-text-color)] pt-3">
          Мои витрины
        </h1>
      </div>

      <div className="p-4">
        {showcases.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--tg-theme-section-bg-color)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--tg-theme-hint-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-[var(--tg-theme-hint-color)] mb-6 text-sm">
              У вас пока нет витрин
            </p>
            <Link
              href="/showcase/create"
              className="inline-flex items-center gap-2 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-medium py-2.5 px-5 rounded-xl text-sm active:opacity-70"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Создать витрину
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {showcases.map((showcase) => (
              <Link
                key={showcase.id}
                href={`/showcase/${showcase.id}`}
                className="flex items-center gap-3 bg-[var(--tg-theme-section-bg-color)] rounded-xl p-3 active:opacity-70 transition-opacity"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: showcase.primaryColor }}
                >
                  {showcase.logoUrl ? (
                    <img src={showcase.logoUrl} alt={showcase.name} className="w-7 h-7 object-contain" />
                  ) : (
                    <span className="text-white text-lg font-semibold">{showcase.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-[var(--tg-theme-text-color)] truncate">
                    {showcase.name}
                  </h3>
                  <p className="text-xs text-[var(--tg-theme-hint-color)] truncate">
                    @{showcase.uniqueName}
                  </p>
                </div>
                <svg className="w-4 h-4 text-[var(--tg-theme-hint-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showcases.length > 0 && (
        <Link
          href="/showcase/create"
          className="fixed right-4 w-12 h-12 bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] rounded-full shadow-lg flex items-center justify-center active:opacity-70"
          style={{ bottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </Link>
      )}
    </div>
  );
}
