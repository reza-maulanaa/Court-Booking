const LINKS = [
  { label: "Lapangan", href: "#lapangan" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Galeri", href: "#galeri" },
  { label: "FAQ", href: "#faq" },
  { label: "Lokasi", href: "#lokasi" },
];

export function LandingNav() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-between border-b border-tf-ink/10 bg-white px-4 py-4 md:px-14">
      <a href="#" className="flex items-center gap-3">
        <span className="grid size-[38px] place-items-center rounded-lg bg-tf-green font-barlow-condensed text-lg font-extrabold italic text-tf-lime">
          TF
        </span>
        <span className="font-barlow-condensed text-[22px] font-extrabold uppercase tracking-[0.5px] text-tf-ink">
          Tanjung <span className="text-tf-green">Futsal</span>
        </span>
      </a>
      <div className="hidden gap-7 text-sm font-semibold md:flex">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-tf-ink hover:text-tf-green"
          >
            {l.label}
          </a>
        ))}
      </div>
      <a
        href="#booking"
        className="rounded-lg bg-tf-green px-[22px] py-[11px] text-sm font-bold text-white hover:bg-tf-green-deep"
      >
        Booking Sekarang
      </a>
    </div>
  );
}
