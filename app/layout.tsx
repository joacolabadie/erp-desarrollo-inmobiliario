import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";

const onest = Onest();

export const metadata: Metadata = {
  title: "ERP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={onest.className}>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
