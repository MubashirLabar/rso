import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/global.css";
import { ToastProvider } from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RSO",
  description: "Generated by RSO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        <>{children}</>
      </body>
    </html>
  );
}
