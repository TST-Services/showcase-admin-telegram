/**
 * Компонент для учета safe area на iOS/Android
 */

export function SafeAreaTop({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ height: "var(--tg-safe-area-inset-top)" }}
    />
  );
}

export function SafeAreaBottom({ className = "" }: { className?: string }) {
  return (
    <div
      className={className}
      style={{ height: "var(--tg-safe-area-inset-bottom)" }}
    />
  );
}

/**
 * Утилита для добавления padding с учетом safe area
 */
export const safeAreaClasses = {
  paddingTop: "pt-[var(--tg-safe-area-inset-top)]",
  paddingBottom: "pb-[var(--tg-safe-area-inset-bottom)]",
  paddingLeft: "pl-[var(--tg-safe-area-inset-left)]",
  paddingRight: "pr-[var(--tg-safe-area-inset-right)]",
  paddingX:
    "pl-[var(--tg-safe-area-inset-left)] pr-[var(--tg-safe-area-inset-right)]",
  paddingY:
    "pt-[var(--tg-safe-area-inset-top)] pb-[var(--tg-safe-area-inset-bottom)]",
  padding:
    "pt-[var(--tg-safe-area-inset-top)] pb-[var(--tg-safe-area-inset-bottom)] pl-[var(--tg-safe-area-inset-left)] pr-[var(--tg-safe-area-inset-right)]",
};

