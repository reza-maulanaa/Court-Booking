import { SectionHeading } from "./section-heading";

const FACILITIES = [
  {
    name: "Parkir luas & aman",
    desc: "Muat 40 motor dan 12 mobil, dijaga hingga tutup.",
  },
  {
    name: "Kantin & minuman dingin",
    desc: "Isotonik, kopi, dan gorengan hangat di pinggir lapangan.",
  },
  {
    name: "Musala & tempat wudhu",
    desc: "Bersih, tersedia sarung dan mukena.",
  },
  {
    name: "Kamar mandi & shower",
    desc: "4 bilik shower air bersih, bisa langsung pulang wangi.",
  },
  {
    name: "Sewa perlengkapan",
    desc: "Rompi dan bola gratis; sepatu futsal Rp 10.000/pasang.",
  },
  {
    name: "Tribun penonton",
    desc: "Bangku tribun untuk supporter di Lapangan B.",
  },
];

export function FacilitiesSection() {
  return (
    <div id="fasilitas" className="scroll-mt-16 bg-tf-mist px-4 py-12 md:px-14 md:py-16">
      <SectionHeading kicker="Fasilitas" title="Datang bawa badan aja" />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {FACILITIES.map((f) => (
          <div
            key={f.name}
            className="flex items-start gap-3.5 rounded-xl border border-tf-ink/10 bg-white px-[22px] py-5"
          >
            <span className="mt-[5px] size-2.5 flex-none rounded-[3px] border-2 border-tf-green bg-tf-lime" />
            <div>
              <div className="text-base font-bold text-tf-ink">{f.name}</div>
              <div className="mt-[3px] text-[13px] leading-normal text-tf-muted">
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
