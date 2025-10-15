"use client";

import { useState, useEffect } from "react";

export default function UnauthorizedPage() {
  const [telegramId, setTelegramId] = useState<string | null>(null);

  useEffect(() => {
    // Получаем Telegram ID пользователя
    import("@twa-dev/sdk")
      .then((module) => {
        const WebApp = module.default;
        const userId = WebApp.initDataUnsafe?.user?.id;
        if (userId) {
          setTelegramId(userId.toString());
        }
      })
      .catch((error) => {
        console.error("Failed to get Telegram user ID:", error);
      });
  }, []);

  const handleClose = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");
    WebApp.close();
  };

  const handleCopyId = async () => {
    if (!telegramId) return;

    try {
      await navigator.clipboard.writeText(telegramId);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert("ID скопирован в буфер обмена!");
    } catch (error) {
      console.error("Failed to copy ID:", error);
      const { default: WebApp } = await import("@twa-dev/sdk");
      WebApp.showAlert(`Ваш Telegram ID: ${telegramId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--tg-theme-bg-color)]">
      <div className="max-w-md w-full text-center">
        <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-[var(--tg-theme-destructive-text-color)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-3 text-[var(--tg-theme-text-color)]">
            Доступ запрещен
          </h1>

          <p className="text-[var(--tg-theme-hint-color)] mb-6">
            У вас нет доступа к этому приложению. Обратитесь к администратору
            для получения доступа.
          </p>

          {telegramId && (
            <div className="mb-6 bg-[var(--tg-theme-bg-color)] rounded-xl p-4">
              <p className="text-sm text-[var(--tg-theme-hint-color)] mb-2">
                Ваш Telegram ID:
              </p>
              <p className="text-lg font-mono font-semibold text-[var(--tg-theme-text-color)] mb-3">
                {telegramId}
              </p>
              <button
                onClick={handleCopyId}
                className="w-full bg-[var(--tg-theme-section-bg-color)] text-[var(--tg-theme-text-color)] font-medium py-2 px-4 rounded-lg hover:opacity-80 transition-opacity border border-[var(--tg-theme-secondary-bg-color)]"
              >
                📋 Скопировать ID
              </button>
            </div>
          )}

          <button
            onClick={handleClose}
            className="w-full bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] font-semibold py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
