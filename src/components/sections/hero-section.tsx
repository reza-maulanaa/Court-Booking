import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroVideo } from "./hero-video";

// Wrapper 300vh = ruang scroll untuk scrubbing video; konten sticky
// setinggi viewport. Reduced-motion: wrapper kolaps ke 85svh murni via
// CSS, jadi user reduce dapat hero statis biasa (DESAIN §2c).
export function HeroSection() {
  return (
    <section data-hero className="relative h-[85svh] motion-safe:h-[300vh]">
      <div className="sticky top-0 flex h-[85svh] min-h-[420px] items-center overflow-hidden motion-safe:h-svh">
        {/* Poster di lapisan bawah: koneksi lambat & prefers-reduced-motion */}
        <Image
          src="/hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <HeroVideo />
        {/* Overlay hitam 50%: jaminan kontras teks di frame mana pun */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative mx-auto w-full max-w-5xl px-4">
          <div className="flex max-w-xl flex-col items-start gap-6 text-white">
            <span className="rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              Booking online, konfirmasi cepat
            </span>
            <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              Booking lapangan futsal{" "}
              <span className="text-emerald-300">tanpa ribet</span>
            </h1>
            <p className="text-pretty text-lg text-white/80 md:text-xl">
              Cek jam kosong, pilih slot, langsung main. Konfirmasi cepat,
              tanpa telepon-teleponan.
            </p>
            <Button
              size="lg"
              className="h-13 px-8 text-base font-semibold shadow-lg shadow-black/20"
              asChild
            >
              <Link href="#katalog">Lihat Lapangan</Link>
            </Button>
          </div>
        </div>

        <ChevronDown
          aria-hidden
          className="absolute bottom-6 left-1/2 size-7 -translate-x-1/2 text-white/70 motion-safe:animate-bounce"
        />
      </div>
    </section>
  );
}
