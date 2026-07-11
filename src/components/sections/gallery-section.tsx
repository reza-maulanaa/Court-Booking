import Image from "next/image";
import { SectionHeading } from "./section-heading";

// Placeholder bergaris = slot untuk foto asli (belum tersedia).
const PLACEHOLDERS = [
  "foto tribun",
  "foto kantin",
  "foto pertandingan malam",
  "foto area parkir",
];

export function GallerySection() {
  return (
    <div id="galeri" className="scroll-mt-16 bg-white px-4 py-12 md:px-14 md:py-16">
      <SectionHeading kicker="Galeri" title="Suasana di Booking Futsal" />
      <div className="grid auto-rows-[220px] gap-3.5 sm:grid-cols-2 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl sm:col-span-2">
          <Image
            src="/court.jpg"
            alt="Lapangan"
            fill
            sizes="(min-width: 768px) 66vw, 100vw"
            className="object-cover"
          />
        </div>
        {PLACEHOLDERS.map((label) => (
          <div
            key={label}
            className="tf-stripes grid place-items-center rounded-xl font-mono text-[13px] font-medium text-tf-muted"
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
