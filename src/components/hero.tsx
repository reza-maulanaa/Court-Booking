"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";

// Markup = keadaan akhir animasi; timeline pakai .from() supaya
// prefers-reduced-motion (branch matchMedia tidak jalan) langsung
// melihat hero utuh tanpa gerak.
export function Hero() {
  const scope = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia(scope);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.from(".garis", {
        strokeDashoffset: 100,
        duration: 0.7,
        stagger: 0.15,
      })
        .from(
          "#bola",
          {
            attr: { cx: 45, cy: 195 },
            scale: 0,
            transformOrigin: "center",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3",
        )
        .from(
          ".hero-text > *",
          { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.12 },
          "-=0.3",
        );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={scope}
      className="mx-auto grid max-w-5xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20"
    >
      <div className="hero-text flex flex-col items-start gap-5">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
          Booking lapangan futsal tanpa ribet
        </h1>
        <p className="text-lg text-muted-foreground md:text-xl">
          Cek jam kosong, pilih slot, langsung main. Konfirmasi cepat, tanpa
          telepon-teleponan.
        </p>
        <Button size="lg" className="h-12 px-8 text-base font-semibold" asChild>
          <Link href="#katalog">Lihat Lapangan</Link>
        </Button>
      </div>

      <svg
        viewBox="0 0 400 240"
        role="img"
        aria-label="Ilustrasi lapangan futsal"
        className="w-full"
      >
        {/* rumput */}
        <rect x="8" y="8" width="384" height="224" rx="12" fill="var(--primary)" />
        {/* garis lapangan — pathLength 100 supaya dash draw-nya seragam */}
        <g
          stroke="#fff"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="[&>.garis]:[stroke-dasharray:100]"
        >
          <rect className="garis" x="28" y="28" width="344" height="184" rx="4" pathLength={100} />
          <line className="garis" x1="200" y1="28" x2="200" y2="212" pathLength={100} />
          <circle className="garis" cx="200" cy="120" r="32" pathLength={100} />
          {/* area penalti kiri & kanan (busur seperempat lingkaran khas futsal) */}
          <path className="garis" d="M 28 75 A 55 55 0 0 1 83 120 A 55 55 0 0 1 28 165" pathLength={100} />
          <path className="garis" d="M 372 75 A 55 55 0 0 0 317 120 A 55 55 0 0 0 372 165" pathLength={100} />
        </g>
        {/* bola */}
        <circle id="bola" cx="200" cy="120" r="8" fill="#fff" />
      </svg>
    </section>
  );
}
