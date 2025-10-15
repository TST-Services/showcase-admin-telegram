import type { Metadata, Viewport } from "next";
import "@/index.css";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
  title: "Banki Showcase Admin",
  description: "Админка для онлайн витрин",
};

// eslint-disable-next-line react-refresh/only-export-components
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover", // Важно для safe area
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
