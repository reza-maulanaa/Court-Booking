"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateChips } from "@/components/date-chips";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, type BookingStatus } from "@/components/status-badge";
import { CLOSE_HOUR, MAX_DAYS_AHEAD, OPEN_HOUR, todayWIB } from "@/lib/constants";

type AdminBooking = {
  id: string;
  bookingDate: string;
  startHour: number;
  durationHours: number;
  hargaSnapshot: number;
  proofUrl: string | null;
  status: BookingStatus;
  userName: string | null;
  userEmail: string | null;
  guestName: string | null;
  guestPhone: string | null;
  fieldName: string;
};

type Field = { id: string; name: string };

// aksi yang ditawarkan per status = state machine versi tombol
const ACTIONS: Partial<
  Record<BookingStatus, { label: string; to: BookingStatus; variant: "default" | "outline" | "destructive" }[]>
> = {
  pending: [
    { label: "Konfirmasi", to: "confirmed", variant: "default" },
    { label: "Tolak", to: "cancelled", variant: "destructive" },
  ],
  confirmed: [
    { label: "Selesai", to: "completed", variant: "outline" },
    { label: "Batalkan", to: "cancelled", variant: "destructive" },
  ],
};

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const jam = (h: number) => `${String(h).padStart(2, "0")}.00`;

const maxCloseDate = (() => {
  const d = new Date(`${todayWIB()}T00:00:00`);
  d.setDate(d.getDate() + MAX_DAYS_AHEAD);
  return d.toLocaleDateString("en-CA");
})();

export default function AdminPage() {
  const [bookings, setBookings] = useState<AdminBooking[] | null>(null);
  const [allFields, setAllFields] = useState<Field[]>([]);
  const [date, setDate] = useState("");
  const [fieldId, setFieldId] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);

  const [showClose, setShowClose] = useState(false);
  const [closeFieldId, setCloseFieldId] = useState("");
  const [closeDate, setCloseDate] = useState(todayWIB());
  const [closeHour, setCloseHour] = useState(OPEN_HOUR);
  const [closeDuration, setCloseDuration] = useState(1);
  const [closeGuestName, setCloseGuestName] = useState("");
  const [closeGuestPhone, setCloseGuestPhone] = useState("");
  const [closing, setClosing] = useState(false);

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (date) params.set("date", date);
    if (fieldId !== "all") params.set("fieldId", fieldId);
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error ?? "Gagal memuat data.");
      return;
    }
    setBookings(data);
  }, [date, fieldId]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  useEffect(() => {
    fetch("/api/fields")
      .then((r) => r.json())
      .then((data: Field[]) => {
        setAllFields(data);
        setCloseFieldId((cur) => cur || (data[0]?.id ?? ""));
      })
      .catch(() => {});
  }, []);

  async function closeBooking() {
    setClosing(true);
    const res = await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fieldId: closeFieldId,
        bookingDate: closeDate,
        startHour: closeHour,
        durationHours: closeDuration,
        guestName: closeGuestName,
        guestPhone: closeGuestPhone,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      toast.error(data?.error ?? "Gagal close booking.");
    } else {
      toast.success("Booking walk-in tercatat & langsung dikonfirmasi.");
      setCloseGuestName("");
      setCloseGuestPhone("");
      setShowClose(false);
      load();
    }
    setClosing(false);
  }

  async function transition(id: string, to: BookingStatus, label: string) {
    setBusy(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: to }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) toast.error(data?.error ?? `Gagal ${label.toLowerCase()}.`);
    else toast.success(`${label} berhasil.`);
    setBusy(null);
    load();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="font-heading mb-6 text-4xl font-extrabold tracking-wide uppercase italic">
        Dashboard Admin
      </h1>

      <div className="mb-6 grid gap-4">
        <div className="grid gap-2">
          <span className="text-sm font-bold">Tanggal</span>
          <DateChips value={date} onChange={setDate} withAll />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="filter-lapangan" className="font-bold">
            Lapangan
          </Label>
          <Select value={fieldId} onValueChange={setFieldId}>
            <SelectTrigger id="filter-lapangan" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua lapangan</SelectItem>
              {allFields.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Button variant="outline" onClick={() => setShowClose((v) => !v)}>
          {showClose ? "Batal" : "+ Close Booking (Walk-in Cash)"}
        </Button>
        {showClose && (
          <div className="mt-3 grid gap-4 rounded-2xl border p-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="close-lapangan" className="font-bold">
                Lapangan
              </Label>
              <Select value={closeFieldId} onValueChange={setCloseFieldId}>
                <SelectTrigger id="close-lapangan" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allFields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="close-tanggal" className="font-bold">
                Tanggal
              </Label>
              <Input
                id="close-tanggal"
                type="date"
                value={closeDate}
                min={todayWIB()}
                max={maxCloseDate}
                onChange={(e) => setCloseDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="close-jam" className="font-bold">
                  Jam mulai
                </Label>
                <Input
                  id="close-jam"
                  type="number"
                  min={OPEN_HOUR}
                  max={CLOSE_HOUR - 1}
                  value={closeHour}
                  onChange={(e) => setCloseHour(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="close-durasi" className="font-bold">
                  Durasi (jam)
                </Label>
                <Input
                  id="close-durasi"
                  type="number"
                  min={1}
                  value={closeDuration}
                  onChange={(e) => setCloseDuration(Number(e.target.value))}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="close-nama" className="font-bold">
                Nama tamu
              </Label>
              <Input
                id="close-nama"
                value={closeGuestName}
                onChange={(e) => setCloseGuestName(e.target.value)}
                placeholder="Nama tamu"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="close-hp" className="font-bold">
                No. HP (opsional)
              </Label>
              <Input
                id="close-hp"
                value={closeGuestPhone}
                onChange={(e) => setCloseGuestPhone(e.target.value)}
                placeholder="08xx-xxxx-xxxx"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={closeBooking}
                disabled={closing || !closeFieldId || !closeGuestName.trim()}
                className="w-full"
              >
                {closing ? "Menyimpan..." : "Konfirmasi Booking Cash"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {bookings === null ? (
        <p className="text-base text-muted-foreground">Memuat...</p>
      ) : bookings.length === 0 ? (
        <p className="text-base text-muted-foreground">
          Tidak ada booking untuk filter ini.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jam</TableHead>
                <TableHead>Lapangan</TableHead>
                <TableHead>Pemesan</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Bukti</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.bookingDate}</TableCell>
                  <TableCell>
                    {jam(b.startHour)}–{jam(b.startHour + b.durationHours)}
                  </TableCell>
                  <TableCell>{b.fieldName}</TableCell>
                  <TableCell>
                    {b.userName ? (
                      <>
                        <div className="font-medium">{b.userName}</div>
                        <div className="text-sm text-muted-foreground">
                          {b.userEmail}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5 font-medium">
                          {b.guestName}
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">
                            Cash
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {b.guestPhone || "—"}
                        </div>
                      </>
                    )}
                  </TableCell>
                  <TableCell>
                    {rupiah.format(b.hargaSnapshot * b.durationHours)}
                  </TableCell>
                  <TableCell>
                    {b.proofUrl ? (
                      <a
                        href={`/api/bookings/${b.id}/proof`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block font-semibold text-primary transition-all duration-200 hover:scale-105 hover:text-primary/80 active:scale-95"
                      >
                        Lihat
                      </a>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {(ACTIONS[b.status] ?? []).map((a) => (
                        <Button
                          key={a.to}
                          size="sm"
                          variant={a.variant}
                          disabled={busy === b.id}
                          onClick={() => transition(b.id, a.to, a.label)}
                        >
                          {a.label}
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
