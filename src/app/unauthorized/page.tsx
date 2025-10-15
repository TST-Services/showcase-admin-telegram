"use client";

export default function UnauthorizedPage() {
  const handleClose = async () => {
    const { default: WebApp } = await import("@twa-dev/sdk");
    WebApp.close();
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
