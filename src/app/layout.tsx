import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Lapangan Futsal",
  description: "Booking lapangan futsal online — pilih jam, langsung main.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <footer className="mt-auto border-t bg-muted/40">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row">
            <p className="font-semibold text-foreground">Booking Futsal</p>
            <p>Buka setiap hari 08.00–23.00 WIB</p>
          </div>
        </footer>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
