"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

// Scroll-scrubbing (DESAIN §2c update 2): progress video terikat posisi
// scroll di dalam wrapper [data-hero]. Kalau user minta reduced-motion,
// <video> tidak dirender sama sekali supaya 4,7MB-nya tidak ikut terunduh;
// layout kolaps ke hero statis via CSS motion-safe di hero-section.
export function HeroVideo() {
  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const wrapper = video.closest<HTMLElement>("[data-hero]");
    if (!wrapper) return;

    // iOS Safari kadang tidak me-render frame hasil seek sebelum video
    // pernah "diaktifkan" — play+pause sekali menyalakan pipeline decode.
    const prime = () => {
      video.play().then(() => video.pause()).catch(() => {});
    };
    if (video.readyState >= 1) prime();
    else video.addEventListener("loadedmetadata", prime, { once: true });

    let target = 0;
    let current = 0;
    let raf = 0;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(Math.max(-rect.top / scrollable, 0), 1) : 0;
      target = progress * (video.duration || 0);
    };

    // currentTime dikejar bertahap (lerp), bukan di-set langsung —
    // scroll wheel melompat-lompat, lerp yang bikin gerakannya halus.
    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) > 0.01 && !video.seeking) {
        video.currentTime = current;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", prime);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <video
      ref={ref}
      muted
      playsInline
      preload="auto"
      src="/futsal-scrub.mp4"
      poster="/hero-poster.jpg"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
