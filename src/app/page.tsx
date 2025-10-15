import { Suspense } from "react";
import ShowcaseList from "@/components/pages/ShowcaseList";
import TelegramProvider from "@/components/providers/TelegramProvider";

export default function Home() {
  return (
    <TelegramProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto"></div>
              <p className="mt-4 text-[var(--tg-theme-hint-color)]">
                Загрузка...
              </p>
            </div>
          </div>
        }
      >
        <ShowcaseList />
      </Suspense>
    </TelegramProvider>
  );
}
