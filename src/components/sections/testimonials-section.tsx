import { SectionHeading } from "./section-heading";

const TESTIMONIALS = [
  {
    quote:
      "Bookingnya beneran sat-set. Pesan jam 9 pagi, malamnya langsung main. Lapangannya juga rata, nggak licin.",
    name: "Rizky Pratama",
    team: "Kapten FC Garuda Muda",
  },
  {
    quote:
      "Tiap Jumat malam tim kantor main di sini. Harga rata 50rb itu juara sih, nggak ada tarif malam yang bikin kaget.",
    name: "Dedi Kurniawan",
    team: "Komunitas Futsal BUMN",
  },
  {
    quote:
      "Fasilitasnya lengkap — anak-anak bisa mandi dulu sebelum pulang. Parkirnya juga aman walau pulang jam 11 malam.",
    name: "Fajar Hidayat",
    team: "Akademi Futsal Junior",
  },
];

export function TestimonialsSection() {
  return (
    <div className="bg-tf-forest px-4 py-12 md:px-14 md:py-16">
      <SectionHeading
        dark
        kicker="Testimoni"
        title="Kata mereka yang rutin main"
      />
      <div className="grid gap-[18px] md:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="rounded-[14px] border border-white/10 bg-tf-forest-card p-6"
          >
            <div
              aria-label="Rating 5 dari 5 bintang"
              className="font-barlow-condensed text-xl font-extrabold tracking-[2px] text-tf-lime"
            >
              ★★★★★
            </div>
            <blockquote className="my-3 mb-[18px] text-[15px] leading-[1.65] text-tf-cloud">
              “{t.quote}”
            </blockquote>
            <figcaption>
              <div className="text-sm font-bold text-white">{t.name}</div>
              <div className="text-xs text-tf-sage">{t.team}</div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
