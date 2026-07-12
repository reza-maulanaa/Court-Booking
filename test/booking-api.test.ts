import { describe, it, expect, beforeAll } from "vitest";

const BASE = process.env.TEST_BASE_URL ?? "http://localhost:3001";

async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error(`login ${email} gagal: ${res.status}`);
  const cookie = res.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error("cookie session tidak ada");
  return (path: string, init: RequestInit = {}) =>
    fetch(`${BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", Cookie: cookie },
    });
}

// tanggal acak 3–23 hari ke depan — tiap describe punya sendiri,
// biar antar-tes dan antar-run nggak rebutan slot
function tanggalAcak() {
  const d = new Date();
  d.setDate(d.getDate() + 3 + Math.floor(Math.random() * 20));
  return d.toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" });
}
const jamAcak = () => 8 + Math.floor(Math.random() * 14);

let user: Awaited<ReturnType<typeof login>>;
let admin: Awaited<ReturnType<typeof login>>;
let fieldId: string;

beforeAll(async () => {
  user = await login("biasa@test.com", "rahasia123");
  admin = await login("tester3d@test.com", "rahasia123");
  const fields = await (await fetch(`${BASE}/api/fields`)).json();
  fieldId = fields[0].id;
});

describe("double-booking paralel (SPEC §6)", () => {
  it("dua request slot sama: tepat satu 201 dan satu 409 ramah", async () => {
    const body = JSON.stringify({
      fieldId,
      bookingDate: tanggalAcak(),
      startHour: jamAcak(),
      durationHours: 1,
    });
    const [a, b] = await Promise.all([
      user("/api/bookings", { method: "POST", body }),
      user("/api/bookings", { method: "POST", body }),
    ]);

    expect([a.status, b.status].sort()).toEqual([201, 409]);

    const kalah = a.status === 409 ? a : b;
    expect((await kalah.json()).error).toContain("sudah dibooking");

    // self-cleaning: batalin yang menang, run berikutnya bebas
    const menang = a.status === 201 ? a : b;
    const { id } = await menang.json();
    await user(`/api/bookings/${id}`, { method: "PATCH" });
  });
});

describe("guest checkout (tanpa login)", () => {
  const guestBody = () =>
    JSON.stringify({
      fieldId,
      bookingDate: tanggalAcak(),
      startHour: jamAcak(),
      durationHours: 1,
      guestName: "Tamu Tes",
      guestPhone: "081200000000",
    });

  it("booking tanpa cookie sesi berhasil (201), userId null", async () => {
    const res = await fetch(`${BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: guestBody(),
    });
    expect(res.status).toBe(201);
    const b = await res.json();
    expect(b.userId).toBeNull();
    expect(b.guestName).toBe("Tamu Tes");

    // ID sendiri = bukti kepemilikan: GET & cancel jalan tanpa sesi
    const get = await fetch(`${BASE}/api/bookings/${b.id}`);
    expect(get.status).toBe(200);

    const cancel = await fetch(`${BASE}/api/bookings/${b.id}`, {
      method: "PATCH",
    });
    expect(cancel.status).toBe(200);
  });

  it("tanpa guestName/guestPhone: 400", async () => {
    const res = await fetch(`${BASE}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fieldId,
        bookingDate: tanggalAcak(),
        startHour: jamAcak(),
        durationHours: 1,
      }),
    });
    expect(res.status).toBe(400);
  });

  it("booking milik user login tidak bisa diakses tanpa sesi", async () => {
    const res = await user("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        fieldId,
        bookingDate: tanggalAcak(),
        startHour: jamAcak(),
        durationHours: 1,
      }),
    });
    const { id } = await res.json();
    const anon = await fetch(`${BASE}/api/bookings/${id}`);
    expect(anon.status).toBe(404);
    await user(`/api/bookings/${id}`, { method: "PATCH" }); // beresin
  });
});

describe("Close Booking (admin, walk-in cash)", () => {
  it("admin insert langsung confirmed, userId null, muncul di list", async () => {
    const bookingDate = tanggalAcak();
    const startHour = jamAcak();
    const res = await admin("/api/admin/bookings", {
      method: "POST",
      body: JSON.stringify({
        fieldId,
        bookingDate,
        startHour,
        durationHours: 1,
        guestName: "Walk-in Tes",
      }),
    });
    expect(res.status).toBe(201);
    const b = await res.json();
    expect(b.status).toBe("confirmed");
    expect(b.userId).toBeNull();

    const list = await admin(`/api/admin/bookings?date=${bookingDate}`);
    const found = (await list.json()).find((x: { id: string }) => x.id === b.id);
    expect(found?.guestName).toBe("Walk-in Tes");

    await admin(`/api/admin/bookings/${b.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    }); // beresin
  });

  it("slot bentrok: 409", async () => {
    const bookingDate = tanggalAcak();
    const startHour = jamAcak();
    const body = JSON.stringify({
      fieldId,
      bookingDate,
      startHour,
      durationHours: 1,
      guestName: "Walk-in A",
    });
    const first = await admin("/api/admin/bookings", { method: "POST", body });
    expect(first.status).toBe(201);
    const second = await admin("/api/admin/bookings", {
      method: "POST",
      body: JSON.stringify({
        fieldId,
        bookingDate,
        startHour,
        durationHours: 1,
        guestName: "Walk-in B",
      }),
    });
    expect(second.status).toBe(409);

    const { id } = await first.json();
    await admin(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "cancelled" }),
    });
  });

  it("bukan admin: 403", async () => {
    const res = await user("/api/admin/bookings", {
      method: "POST",
      body: JSON.stringify({
        fieldId,
        bookingDate: tanggalAcak(),
        startHour: jamAcak(),
        durationHours: 1,
        guestName: "X",
      }),
    });
    expect(res.status).toBe(403);
  });
});

describe("state machine transisi (SPEC §6)", () => {
  let id: string;

  beforeAll(async () => {
    const res = await user("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        fieldId,
        bookingDate: tanggalAcak(),
        startHour: jamAcak(),
        durationHours: 1,
      }),
    });
    expect(res.status).toBe(201);
    id = (await res.json()).id;
  });

  const patch = (status: string) =>
    admin(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

  it("pending → completed (loncat) ditolak 409", async () => {
    expect((await patch("completed")).status).toBe(409);
  });
  it("pending → confirmed sah", async () => {
    expect((await patch("confirmed")).status).toBe(200);
  });
  it("confirmed → cancelled sah", async () => {
    expect((await patch("cancelled")).status).toBe(200);
  });
  it("cancelled terminal: → confirmed ditolak 409", async () => {
    expect((await patch("confirmed")).status).toBe(409);
  });
  it("pending bukan tujuan sah: 400", async () => {
    expect((await patch("pending")).status).toBe(400);
  });
  it("user biasa nembak endpoint admin: 403", async () => {
    const res = await user(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: "confirmed" }),
    });
    expect(res.status).toBe(403);
  });
});
