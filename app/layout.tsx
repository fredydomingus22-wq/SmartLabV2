import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SMARTLIMS 4.0",
  description: "LIMS Enterprise for Food & Beverage Industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
            <Header />
            <main className="flex-1 p-4 sm:px-6 sm:py-0">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
