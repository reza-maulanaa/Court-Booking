import Link from "next/link";
import { db } from "@/db";
import { Hero } from "@/components/hero";
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

export default async function Home() {
  const allFields = await db.query.fields.findMany({
    orderBy: (f, { asc }) => asc(f.name),
  });

  return (
    <>
      <Hero />

      <section id="katalog" className="mx-auto w-full max-w-5xl px-4 pb-16">
        <h2 className="mb-6 text-3xl font-extrabold tracking-tight">
          Pilih Lapangan
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {allFields.map((field) => (
            <Card key={field.id}>
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
                  <Link href={`/fields/${field.id}`}>Lihat jadwal</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
