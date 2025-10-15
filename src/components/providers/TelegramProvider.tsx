"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkUserAccess } from "@/lib/auth";

const AUTH_CACHE_KEY = "tg_auth_status";
const AUTH_USER_KEY = "tg_auth_user_id";

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [WebApp, setWebApp] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === "undefined") return;

    // Динамический импорт SDK только на клиенте
    import("@twa-dev/sdk")
      .then((module) => {
        const twa = module.default;

        // Проверяем, что Telegram WebApp доступен
        if (!twa || !twa.initData) {
          console.warn("Telegram WebApp not available");
          // Для разработки - используем mock данные
          if (process.env.NODE_ENV === "development") {
            console.log("Development mode: using mock Telegram data");
            setWebApp({
              initDataUnsafe: {
                user: {
                  id: 123456789, // Mock ID для разработки
                  first_name: "Dev",
                  username: "developer",
                },
              },
              ready: () => {},
              expand: () => {},
              close: () => {},
              BackButton: {
                show: () => {},
                hide: () => {},
                onClick: () => {},
              },
              showAlert: (msg: string) => alert(msg),
              showConfirm: (
                msg: string,
                callback: (confirmed: boolean) => void
              ) => callback(confirm(msg)),
              colorScheme: "light",
            });
            setIsReady(true);
            return;
          }
          setIsReady(true);
          return;
        }

        setWebApp(twa);

        try {
          // Инициализация Telegram WebApp
          twa.ready();
          twa.expand();

          // Настройка цветовой схемы
          if (twa.colorScheme === "dark") {
            document.documentElement.style.setProperty(
              "--tg-theme-bg-color",
              "#18222d"
            );
            document.documentElement.style.setProperty(
              "--tg-theme-text-color",
              "#ffffff"
            );
            document.documentElement.style.setProperty(
              "--tg-theme-secondary-bg-color",
              "#1f2b38"
            );
            document.documentElement.style.setProperty(
              "--tg-theme-section-bg-color",
              "#232e3c"
            );
          }
        } catch (error) {
          console.error("Error initializing Telegram WebApp:", error);
        }

        setIsReady(true);
      })
      .catch((error) => {
        console.error("Error loading Telegram SDK:", error);
        setIsReady(true);
      });
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      if (!WebApp) {
        // Если WebApp недоступен, показываем ошибку
        setIsAuthorized(false);
        return;
      }

      try {
        const telegramUser = WebApp.initDataUnsafe?.user;

        if (!telegramUser || !telegramUser.id) {
          console.warn("No Telegram user data available");
          setIsAuthorized(false);
          router.push("/unauthorized");
          return;
        }

        const userId = telegramUser.id.toString();

        // Проверяем кэш авторизации
        const cachedAuth = sessionStorage.getItem(AUTH_CACHE_KEY);
        const cachedUserId = sessionStorage.getItem(AUTH_USER_KEY);

        // Если есть кэш для этого пользователя, используем его
        if (cachedAuth === "true" && cachedUserId === userId) {
          console.log("Using cached authorization for user:", userId);
          setIsAuthorized(true);
          return;
        }

        console.log("Checking access for user:", userId);

        // Проверяем авторизацию через Server Action
        const hasAccess = await checkUserAccess(telegramUser.id);

        if (hasAccess) {
          // Сохраняем успешную авторизацию в кэш
          sessionStorage.setItem(AUTH_CACHE_KEY, "true");
          sessionStorage.setItem(AUTH_USER_KEY, userId);
          setIsAuthorized(true);
        } else {
          // Очищаем кэш при неудачной авторизации
          sessionStorage.removeItem(AUTH_CACHE_KEY);
          sessionStorage.removeItem(AUTH_USER_KEY);
          setIsAuthorized(false);
          router.push("/unauthorized");
        }
      } catch (error) {
        console.error("Authorization check failed:", error);
        // Очищаем кэш при ошибке
        sessionStorage.removeItem(AUTH_CACHE_KEY);
        sessionStorage.removeItem(AUTH_USER_KEY);
        setIsAuthorized(false);
        router.push("/unauthorized");
      }
    };

    if (isReady) {
      checkAuth();
    }
  }, [isReady, WebApp, router]);

  if (!isReady || isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto"></div>
          <p className="mt-4 text-[var(--tg-theme-hint-color)]">
            Проверка доступа...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
