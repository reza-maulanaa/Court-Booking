const LINKS = [
  { label: "Booking", href: "#booking" },
  { label: "Harga", href: "#lapangan" },
  { label: "FAQ", href: "#faq" },
  { label: "Lokasi", href: "#lokasi" },
];

export function LandingFooter() {
  return (
    <footer className="flex flex-col items-center justify-between gap-5 bg-tf-ink px-4 py-9 md:flex-row md:px-14">
      <div className="flex items-center gap-3">
        <span className="grid size-8 place-items-center rounded-[7px] bg-tf-green font-barlow-condensed text-[15px] font-extrabold italic text-tf-lime">
          TF
        </span>
        <span className="font-barlow-condensed text-lg font-extrabold uppercase text-white">
          Tanjung Futsal
        </span>
      </div>
      <div className="flex gap-6 text-[13px] font-medium">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-tf-sage hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </div>
      <div className="text-xs text-tf-muted">© 2026 Tanjung Futsal</div>
    </footer>
  );
}
