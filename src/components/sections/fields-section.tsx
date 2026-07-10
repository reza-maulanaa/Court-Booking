import Image from "next/image";
import { SectionHeading } from "./section-heading";
import { BookFieldButton } from "./booking-section";
import { fmtRp } from "@/lib/format";

// ponytail: deskripsi + foto kartu di-hardcode per urutan lapangan (A, B) —
// pindah ke kolom DB kalau lapangan jadi dinamis/dikelola admin.
// Foto lapangan B sengaja placeholder bergaris = slot untuk foto asli.
const CARD_META = [
  {
    photo: "/court.jpg",
    desc: "Rumput sintetis premium · 25×15 m · pencahayaan LED · jaring pengaman keliling",
  },
  {
    photo: null,
    placeholder: "foto lapangan B",
    desc: "Vinyl interlock · 25×15 m · cocok untuk turnamen · tribun penonton mini",
  },
];

export type LandingField = {
  id: string;
  name: string;
  hargaPerJam: number;
};

export function FieldsSection({ fields }: { fields: LandingField[] }) {
  return (
    <div id="lapangan" className="scroll-mt-16 bg-white px-4 py-12 md:px-14 md:py-16">
      <SectionHeading kicker="Lapangan & Harga" title="Satu harga, semua jam" />
      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field, i) => {
          const meta = CARD_META[i] ?? CARD_META[CARD_META.length - 1];
          return (
            <div
              key={field.id}
              className="overflow-hidden rounded-2xl border border-tf-ink/10"
            >
              {meta.photo ? (
                <div className="relative h-[260px]">
                  <Image
                    src={meta.photo}
                    alt={field.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="tf-stripes grid h-[260px] place-items-center font-mono text-[13px] font-medium text-tf-muted">
                  {meta.placeholder}
                </div>
              )}
              <div className="px-6 py-[22px]">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="font-barlow-condensed text-[28px] font-extrabold uppercase text-tf-ink">
                    {field.name}
                  </div>
                  <div className="font-barlow-condensed text-[26px] font-extrabold text-tf-green">
                    {fmtRp(field.hargaPerJam)}
                    <span className="font-barlow text-sm font-semibold text-tf-muted">
                      /jam
                    </span>
                  </div>
                </div>
                <p className="mt-2 mb-4 text-sm leading-[1.6] text-tf-muted">
                  {meta.desc}
                </p>
                <BookFieldButton fieldId={field.id}>
                  Booking {field.name}
                </BookFieldButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
