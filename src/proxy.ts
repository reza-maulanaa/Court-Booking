import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifyToken } from "./lib/auth";

// Guest checkout (booking tanpa akun): path di bawah ini menangani
// otorisasinya sendiri di route/page masing-masing (pemilik booking guest
// dibuktikan lewat ID, bukan sesi — lihat ARCHITECTURE §11). Proxy tidak
// boleh blanket-block di sini, kalau tidak guest checkout mati di layer
// ini sebelum sempat nyampe ke route handler-nya.
const GUEST_ACCESSIBLE = [
  /^\/bookings\/[^/]+$/, // halaman status publik /bookings/[id]
  /^\/api\/bookings\/[^/]+(\/proof)?$/, // GET/PATCH booking + upload/lihat bukti
];

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = token ? await verifyToken(token) : null;

  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api");
  const isAdminArea =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  const isGuestAccessible =
    !isAdminArea &&
    (GUEST_ACCESSIBLE.some((re) => re.test(pathname)) ||
      (pathname === "/api/bookings" && req.method === "POST"));

  if (!session && !isGuestAccessible) {
    if (isApi) {
      return NextResponse.json(
        { error: "Silakan login dulu" },
        { status: 401 },
      );
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (isAdminArea && session?.role !== "admin") {
    if (isApi) {
      return NextResponse.json({ error: "Khusus admin" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/bookings/:path*",
    "/admin/:path*",
    "/api/bookings/:path*",
    "/api/admin/:path*",
  ],
};
