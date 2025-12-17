import type { Metadata, Viewport } from "next";
import "@/index.css";
import TelegramThemeProvider from "@/components/providers/TelegramThemeProvider";

export const metadata: Metadata = {
  title: "Banki Showcase Admin",
  description: "Админка для онлайн витрин",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <TelegramThemeProvider />
        {children}
      </body>
    </html>
  );
}
