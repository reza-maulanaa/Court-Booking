import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db, expireStaleBookings } from "@/db";
import { bookings, fields, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { adminBookingSchema } from "@/lib/validator";
import { pgErrorCode } from "@/lib/pg-error";
import { normalizePhone } from "@/lib/phone";

// Close Booking: walk-in bayar cash di tempat, admin insert langsung
// `confirmed` (skip pending/upload bukti — uangnya udah di tangan).
// Reuse EXCLUDE constraint bookings_no_overlap yang sama dipakai booking
// online: kalau slotnya udah ada row aktif (pending/confirmed), insert
// ini kena 23P01 → 409. Gak ada "override paksa" — kalau admin mau
// walk-in menang atas booking online pending, cancel dulu manual
// (PATCH .../[id] existing) baru Close Booking lagi (§11 ARCHITECTURE).
export async function POST(req: Request) {
  const session = await getSession();
  if (session?.role !== "admin")
    return NextResponse.json({ error: "Khusus admin" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = adminBookingSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 },
    );
  const { fieldId, bookingDate, startHour, durationHours, guestName, guestPhone } =
    parsed.data;

  const field = await db.query.fields.findFirst({
    where: eq(fields.id, fieldId),
  });
  if (!field)
    return NextResponse.json(
      { error: "Lapangan tidak ditemukan" },
      { status: 404 },
    );

  await expireStaleBookings();

  try {
    const [booking] = await db
      .insert(bookings)
      .values({
        userId: null,
        guestName,
        guestPhone: guestPhone ? normalizePhone(guestPhone) : null,
        fieldId,
        bookingDate,
        startHour,
        durationHours,
        hargaSnapshot: field.hargaPerJam,
        status: "confirmed",
      })
      .returning();
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    if (pgErrorCode(e) === "23P01")
      return NextResponse.json(
        {
          error:
            "Jam tersebut sudah ada booking aktif. Batalkan booking itu dulu kalau mau ambil alih slotnya.",
        },
        { status: 409 },
      );
    throw e;
  }
}

export async function GET(req: Request) {
  const session = await getSession();
  if (session?.role !== "admin")
    return NextResponse.json({ error: "Khusus admin" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const fieldId = searchParams.get("fieldId");

  const conditions = [];
  if (date) conditions.push(eq(bookings.bookingDate, date));
  if (fieldId) conditions.push(eq(bookings.fieldId, fieldId));

  await expireStaleBookings();

  const list = await db
    .select({
      id: bookings.id,
      bookingDate: bookings.bookingDate,
      startHour: bookings.startHour,
      durationHours: bookings.durationHours,
      hargaSnapshot: bookings.hargaSnapshot,
      proofUrl: bookings.proofUrl,
      status: bookings.status,
      createdAt: bookings.createdAt,
      userName: users.name,
      userEmail: users.email,
      guestName: bookings.guestName,
      guestPhone: bookings.guestPhone,
      fieldName: fields.name,
    })
    .from(bookings)
    // leftJoin, bukan innerJoin: booking walk-in (userId null, §11) gak
    // punya baris users — innerJoin bakal diam-diam menghilangkan mereka
    // dari list admin.
    .leftJoin(users, eq(bookings.userId, users.id))
    .innerJoin(fields, eq(bookings.fieldId, fields.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(bookings.bookingDate), desc(bookings.startHour));

  return NextResponse.json(list);
}
