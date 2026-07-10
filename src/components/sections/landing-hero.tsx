import Image from "next/image";

const STATS = [
  { value: "2", label: "Lapangan indoor" },
  { value: "15 jam", label: "Operasional / hari" },
  { value: "Rp 50rb", label: "Per jam, semua slot" },
];

export function LandingHero() {
  return (
    <div className="relative overflow-hidden bg-tf-forest">
      <Image
        src="/court.jpg"
        alt="Lapangan Tanjung Futsal"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[.38]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(100deg,#08301df2_30%,#08301d80_70%,#0e7b4540)]" />
      <div className="relative max-w-[760px] px-4 pt-16 pb-14 md:px-14 md:pt-[88px] md:pb-[72px]">
        <p className="mb-[22px] inline-flex items-center gap-2 rounded-full border border-tf-lime/40 bg-tf-lime/13 px-3.5 py-[7px] text-xs font-bold uppercase tracking-[2px] text-tf-lime">
          <span className="size-[7px] rounded-full bg-tf-lime" />
          Buka setiap hari · 08.00–23.00
        </p>
        <h1 className="font-barlow-condensed text-5xl leading-[0.95] font-extrabold italic uppercase tracking-[0.5px] text-white sm:text-[64px] md:text-[84px]">
          Booking lapangan,
          <br />
          <span className="text-tf-lime">langsung main.</span>
        </h1>
        <p className="mt-[22px] mb-8 max-w-[520px] text-lg leading-[1.6] text-tf-cloud">
          Pilih jadwal, isi data, bayar — selesai dalam 1 menit. Dua lapangan
          indoor rumput sintetis di pusat kota, mulai{" "}
          <strong className="text-white">Rp 50.000/jam</strong>.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <a
            href="#booking"
            className="rounded-[10px] bg-tf-lime px-[30px] py-[15px] text-base font-bold text-tf-ink hover:bg-tf-lime-bright"
          >
            Booking Sekarang
          </a>
          <a
            href="#lapangan"
            className="rounded-[10px] border-[1.5px] border-white/33 px-[26px] py-3.5 text-base font-semibold text-white hover:border-white"
          >
            Lihat Lapangan &amp; Harga
          </a>
        </div>
        <div className="mt-12 flex flex-wrap gap-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-barlow-condensed text-[34px] font-extrabold text-white">
                {s.value}
              </div>
              <div className="text-[13px] font-medium text-tf-sage">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
