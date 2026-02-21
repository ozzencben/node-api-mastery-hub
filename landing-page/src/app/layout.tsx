import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Node-API Mastery Hub | Discovery Gateway",
  description: "A centralized gateway to explore modular API ecosystems including Finance, Business, and User Management systems.",
  keywords: ["API", "Node.js", "Express", "Prisma", "Swagger", "Backend Hub"],
  authors: [{ name: "Özenç" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
