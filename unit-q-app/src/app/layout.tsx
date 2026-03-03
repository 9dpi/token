import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Token Index - Mobile Terminal",
  description: "Cổng kết nối AI cao cấp và hệ thống quản trị Token Q",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
