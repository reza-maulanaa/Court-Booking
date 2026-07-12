import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createBookingSchema, guestBookingSchema, proofFileError } from "./validator";

// jam palsu semua tes: 2026-07-10 14:30 WIB = 07:30 UTC
const NOW = new Date("2026-07-10T07:30:00Z");

const valid = {
  fieldId: "f-tes",
  bookingDate: "2026-07-15",
  startHour: 10,
  durationHours: 2,
};

describe("createBookingSchema", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("menerima booking valid", () => {
    expect(createBookingSchema.safeParse(valid).success).toBe(true);
  });

  it("menolak yang melewati jam tutup", () => {
    const r = createBookingSchema.safeParse({
      ...valid,
      startHour: 22,
      durationHours: 2,
    });
    expect(r.success).toBe(false);
  });

  it("menolak tanggal di luar 30 hari", () => {
    const r = createBookingSchema.safeParse({
      ...valid,
      bookingDate: "2026-08-15",
    });
    expect(r.success).toBe(false);
  });

  it("menolak jam yang sudah lewat hari ini", () => {
    const r = createBookingSchema.safeParse({
      ...valid,
      bookingDate: "2026-07-10",
      startHour: 14,
    });
    expect(r.success).toBe(false);
  });

  it("menerima jam berikutnya hari ini", () => {
    const r = createBookingSchema.safeParse({
      ...valid,
      bookingDate: "2026-07-10",
      startHour: 15,
    });
    expect(r.success).toBe(true);
  });
});

describe("guestBookingSchema", () => {
  it("menerima nama & No. WhatsApp valid (format 08xx)", () => {
    expect(
      guestBookingSchema.safeParse({ guestName: "Budi", guestPhone: "081234567890" })
        .success,
    ).toBe(true);
  });

  it("menerima format +62/62", () => {
    expect(
      guestBookingSchema.safeParse({ guestName: "Budi", guestPhone: "+6281234567890" })
        .success,
    ).toBe(true);
    expect(
      guestBookingSchema.safeParse({ guestName: "Budi", guestPhone: "6281234567890" })
        .success,
    ).toBe(true);
  });

  it("menolak nama kosong", () => {
    expect(
      guestBookingSchema.safeParse({ guestName: "  ", guestPhone: "081234567890" })
        .success,
    ).toBe(false);
  });

  it("menolak nomor HP bukan format Indonesia", () => {
    expect(
      guestBookingSchema.safeParse({ guestName: "Budi", guestPhone: "12345" }).success,
    ).toBe(false);
    expect(
      guestBookingSchema.safeParse({ guestName: "Budi", guestPhone: "0212345678" })
        .success,
    ).toBe(false);
  });
});

describe("proofFileError", () => {
  const img = (bytes: number, type = "image/png") =>
    new File([new Uint8Array(bytes)], "bukti.png", { type });

  it("menerima gambar normal", () => {
    expect(proofFileError(img(500_000))).toBeNull();
  });

  it("menolak tanpa file / bukan file / file kosong", () => {
    expect(proofFileError(null)).toMatch(/wajib/);
    expect(proofFileError("bukan-file")).toMatch(/wajib/);
    expect(proofFileError(img(0))).toMatch(/wajib/);
  });

  it("menolak non-gambar", () => {
    expect(proofFileError(img(100, "application/pdf"))).toMatch(/gambar/);
  });

  it("menolak di atas batas MB", () => {
    expect(proofFileError(img(4 * 1024 * 1024 + 1))).toMatch(/maksimal/i);
    expect(proofFileError(img(4 * 1024 * 1024))).toBeNull();
  });
});
