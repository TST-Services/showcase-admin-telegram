"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function useTelegramBackButton(backPath: string | null) {
  const router = useRouter();
  const handlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let WebApp: typeof import("@twa-dev/sdk").default;

    const setup = async () => {
      const module = await import("@twa-dev/sdk");
      WebApp = module.default;

      // Удаляем предыдущий обработчик если есть
      if (handlerRef.current) {
        WebApp.BackButton.offClick(handlerRef.current);
      }

      if (backPath) {
        // Создаём новый обработчик
        handlerRef.current = () => router.push(backPath);
        WebApp.BackButton.onClick(handlerRef.current);
        WebApp.BackButton.show();
      } else {
        WebApp.BackButton.hide();
      }
    };

    setup();

    return () => {
      import("@twa-dev/sdk").then((module) => {
        if (handlerRef.current) {
          module.default.BackButton.offClick(handlerRef.current);
          handlerRef.current = null;
        }
      });
    };
  }, [backPath, router]);
}
