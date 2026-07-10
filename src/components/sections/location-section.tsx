import { SectionHeading } from "./section-heading";

const INFO = [
  {
    title: "Alamat",
    body: (
      <>
        Jl. Tanjung Raya No. 88, Kec. Tanjung
        <br />
        (samping SPBU, 5 menit dari alun-alun)
      </>
    ),
  },
  {
    title: "Jam operasional",
    body: <>Setiap hari · 08.00 – 23.00 WIB</>,
  },
];

export function LocationSection() {
  return (
    <div id="lokasi" className="scroll-mt-16 bg-white px-4 py-12 md:px-14 md:py-16">
      <SectionHeading kicker="Lokasi" title="Gampang dicari, parkir luas" />
      <div className="grid items-stretch gap-6 md:grid-cols-[1.3fr_1fr]">
        {/* Placeholder bergaris = slot untuk embed peta asli */}
        <div className="tf-stripes grid min-h-[300px] place-items-center rounded-[14px] border border-tf-ink/10 font-mono text-[13px] font-medium text-tf-muted">
          embed peta Google Maps
        </div>
        <div className="flex flex-col gap-3.5">
          {INFO.map((item) => (
            <div
              key={item.title}
              className="rounded-xl bg-tf-mist px-[22px] py-5"
            >
              <div className="text-sm font-bold text-tf-ink">{item.title}</div>
              <div className="mt-1 text-sm leading-[1.6] text-tf-muted">
                {item.body}
              </div>
            </div>
          ))}
          <div className="rounded-xl bg-tf-mist px-[22px] py-5">
            <div className="text-sm font-bold text-tf-ink">Kontak</div>
            <div className="mt-1 mb-3 text-sm leading-[1.6] text-tf-muted">
              WhatsApp 0812-3456-7890
            </div>
            <a
              href="#booking"
              className="inline-block rounded-lg bg-tf-green px-[18px] py-2.5 text-[13px] font-bold text-white hover:bg-tf-green-deep"
            >
              Booking via Website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
