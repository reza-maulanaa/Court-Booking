import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { db } from "@/db";
import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

// ponytail: foto di-hardcode per nama — pindah ke kolom DB kalau lapangan
// jadi dinamis/dikelola admin
const fieldPhoto: Record<string, string> = {
  "Lapangan A": "/fields/lapangan-a.jpg",
  "Lapangan B": "/fields/lapangan-b.jpg",
};

export default async function Home() {
  const allFields = await db.query.fields.findMany({
    orderBy: (f, { asc }) => asc(f.name),
  });

  return (
    <>
      <HeroSection />

      <section
        id="katalog"
        className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16 md:py-24"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
          Katalog
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Pilih Lapangan
        </h2>
        <p className="mt-2 mb-8 text-muted-foreground md:text-lg">
          Lapangan indoor, harga per jam, jadwal real-time.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
          {allFields.map((field) => (
            <Card
              key={field.id}
              className="group overflow-hidden pt-0 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={fieldPhoto[field.name] ?? "/hero-poster.jpg"}
                  alt={`Foto ${field.name}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{field.name}</CardTitle>
                <CardDescription className="text-base">
                  <span className="text-2xl font-bold text-primary">
                    {rupiah.format(field.hargaPerJam)}
                  </span>{" "}
                  / jam
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  className="w-full text-base font-semibold sm:w-auto"
                  asChild
                >
                  <Link href={`/fields/${field.id}`}>
                    Lihat jadwal
                    <ArrowRight
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
