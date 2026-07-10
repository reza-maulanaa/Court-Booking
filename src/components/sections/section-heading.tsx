// Kicker + judul section landing — pola berulang persis dari prototipe:
// label kecil uppercase ber-tracking lebar di atas judul Barlow Condensed italic.
export function SectionHeading({
  kicker,
  title,
  dark = false,
  spaced = true,
}: {
  kicker: string;
  title: string;
  dark?: boolean;
  spaced?: boolean;
}) {
  return (
    <>
      <p
        className={`text-[13px] font-bold uppercase tracking-[2.5px] ${
          dark ? "text-tf-lime" : "text-tf-green"
        }`}
      >
        {kicker}
      </p>
      <h2
        className={`font-barlow-condensed text-[34px] font-extrabold italic uppercase md:text-[46px] ${
          dark ? "text-white" : "text-tf-ink"
        } ${spaced ? "mb-7" : ""}`}
      >
        {title}
      </h2>
    </>
  );
}
