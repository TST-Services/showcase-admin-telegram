"use client";

import { useEffect } from "react";

export default function TelegramThemeProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    import("@twa-dev/sdk").then((module) => {
      const twa = module.default;

      if (!twa || !twa.initData) {
        console.warn("Telegram WebApp not available");
        return;
      }

      try {
        twa.ready();
        twa.expand();

        const applyTheme = () => {
          const root = document.documentElement;

          // Применяем цвета из themeParams
          const tp = twa.themeParams;
          if (tp) {
            if (tp.bg_color) root.style.setProperty("--tg-theme-bg-color", tp.bg_color);
            if (tp.text_color) root.style.setProperty("--tg-theme-text-color", tp.text_color);
            if (tp.hint_color) root.style.setProperty("--tg-theme-hint-color", tp.hint_color);
            if (tp.link_color) root.style.setProperty("--tg-theme-link-color", tp.link_color);
            if (tp.button_color) root.style.setProperty("--tg-theme-button-color", tp.button_color);
            if (tp.button_text_color) root.style.setProperty("--tg-theme-button-text-color", tp.button_text_color);
            if (tp.secondary_bg_color) root.style.setProperty("--tg-theme-secondary-bg-color", tp.secondary_bg_color);
            if (tp.header_bg_color) root.style.setProperty("--tg-theme-header-bg-color", tp.header_bg_color);
            if (tp.section_bg_color) root.style.setProperty("--tg-theme-section-bg-color", tp.section_bg_color);
            if (tp.section_header_text_color) root.style.setProperty("--tg-theme-section-header-text-color", tp.section_header_text_color);
            if (tp.subtitle_text_color) root.style.setProperty("--tg-theme-subtitle-text-color", tp.subtitle_text_color);
            if (tp.destructive_text_color) root.style.setProperty("--tg-theme-destructive-text-color", tp.destructive_text_color);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const twAny = twa as any;

          // Safe Area Inset — отступ от краёв экрана устройства (notch, dynamic island)
          const safeAreaTop = twAny.safeAreaInset?.top ?? 0;
          const safeAreaBottom = twAny.safeAreaInset?.bottom ?? 0;

          // Content Safe Area Inset — отступ от элементов интерфейса Telegram (кнопки в fullscreen)
          const contentSafeAreaTop = twAny.contentSafeAreaInset?.top ?? 0;

          // Общий отступ для header = safe area + content safe area
          // На десктопе и в обычном режиме эти значения будут 0
          // В fullscreen на мобильных — будут реальные значения
          const headerInset = safeAreaTop + contentSafeAreaTop;

          root.style.setProperty("--tg-safe-area-inset-top", `${safeAreaTop}px`);
          root.style.setProperty("--tg-safe-area-inset-bottom", `${safeAreaBottom}px`);
          root.style.setProperty("--tg-content-safe-area-inset-top", `${contentSafeAreaTop}px`);
          root.style.setProperty("--tg-header-top-inset", `${headerInset}px`);
        };

        applyTheme();

        // Подписываемся на все релевантные события
        twa.onEvent("themeChanged", applyTheme);
        twa.onEvent("viewportChanged", applyTheme);
        twa.onEvent("fullscreenChanged", applyTheme);
        twa.onEvent("safeAreaChanged", applyTheme);
        twa.onEvent("contentSafeAreaChanged", applyTheme);

        return () => {
          twa.offEvent("themeChanged", applyTheme);
          twa.offEvent("viewportChanged", applyTheme);
          twa.offEvent("fullscreenChanged", applyTheme);
          twa.offEvent("safeAreaChanged", applyTheme);
          twa.offEvent("contentSafeAreaChanged", applyTheme);
        };
      } catch (error) {
        console.error("Error initializing Telegram theme:", error);
      }
    });
  }, []);

  return null;
}
