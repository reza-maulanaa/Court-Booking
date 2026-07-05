# DESAIN — UI Sistem Booking Lapangan Futsal

Keputusan desain frontend + alasannya. Kode UI ditulis mengikuti dokumen ini
(bukan sebaliknya). Perubahan keputusan = update dokumen dulu.

## 1. Prinsip

1. **Mobile-first.** Orang booking lapangan dari HP. Layout didesain dari
   layar kecil, melebar ke desktop (`max-w` container + grid yang nambah
   kolom). Pengecualian: halaman admin boleh nyaman di desktop dulu,
   admin kerja dari laptop.
2. **Terang, satu aksen.** Background putih/netral, satu warna aksen hijau
   futsal. Alasan: paling aman buat portfolio, fokus ke fungsionalitas,
   gampang konsisten.
3. **shadcn/ui apa adanya dulu.** Komponen dipakai dengan default-nya;
   kustomisasi cuma lewat token di `globals.css`. Styling manual = jalan
   terakhir.
4. **Backend yang ngomong.** Pesan error dari API (Zod, 401/403/409) sudah
   ramah bahasa Indonesia — UI menampilkan apa adanya, tidak menerjemahkan
   ulang. Satu sumber pesan.

## 2. Tema & token

- Base: netral `zinc` bawaan shadcn, background putih.
- Aksen (primary): **hijau tua lapangan** `oklch(0.527 0.154 150)`
  (≈ Tailwind `green-700`), diset sebagai token `--primary` + `--ring` di
  `globals.css` — SATU tempat, semua komponen ngikut. Dipakai untuk: tombol
  aksi utama, slot terpilih, badge `confirmed`, focus ring.
  Alasan hijau tua (bukan muda): teks putih di atasnya lolos kontras
  4.5:1; hijau muda maksa teks gelap dan pucat di background putih.
  (Keputusan 2026-07-04: user menolak primary hitam default shadcn.)
- Status booking → warna badge (satu-satunya pemakaian warna di luar aksen):
  `pending` kuning, `confirmed` hijau, `completed` abu netral,
  `cancelled` merah pudar.
- Font: Geist (bawaan create-next-app). Radius & shadow: default shadcn.
- **Tidak dibuat**: dark mode. Alasan: nambah ±2× kerja styling tanpa
  nambah nilai demo MVP.

## 2b. Hero section & animasi (keputusan 2026-07-04 — DIGANTIKAN §2c)

> **2026-07-05**: hero SVG + GSAP diganti hero video (§2c). Poin "batas
> pemakaian animasi" dan "prefers-reduced-motion" di bawah tetap berlaku
> sebagai prinsip; implementasi hero-nya yang berubah. gsap sekarang tidak
> dipakai siapa pun — boleh di-uninstall, atau disimpan untuk
> micro-interaction nanti.

- Halaman `/` dibuka **hero section** dengan **animasi lapangan futsal**
  (SVG lapangan: garis lapangan ter-gambar berurutan, bola bergerak,
  headline + CTA "Lihat Lapangan" masuk setelahnya).
- Engine animasi: **GSAP saja** (timeline untuk koreografi berurutan).
  anime.js tidak dipasang — overlap ±95% dengan GSAP; dua engine untuk
  satu hero melanggar prinsip performa.
- Batas pemakaian animasi: hero section saja + micro-interaction kecil
  (hover card, transisi badge). Halaman fungsional (booking, admin) tetap
  tanpa animasi dekoratif — di sana kecepatan > gaya.
- `prefers-reduced-motion` dihormati: animasi hero jadi keadaan akhir
  statis. (Aksesibilitas §5 berlaku juga untuk animasi.)
- Referensi gaya komponen: pola dari 21st.dev / refero.design sebagai
  acuan visual, implementasi tetap shadcn + Tailwind (bukan dependency
  baru).

## 2c. Hero Video (keputusan 2026-07-05)

Decision log — menggantikan hero SVG/GSAP §2b:

- **Video sebagai background hero, bukan gambar statis.** Alasan: footage
  lapangan asli menjual suasana lebih kuat daripada ilustrasi; untuk
  portfolio, hero video juga mendemokan penanganan media + a11y.
  File: `public/futsal.mp4` (1280×720, 10 detik, 2,6MB — ukuran kecil
  disengaja agar layak `preload="auto"`; kalau ganti footage, jaga di
  bawah ±5MB).
- **Aspect ratio asli 16:9, ditampilkan `object-cover`.** Video mengisi
  penuh kontainer di semua breakpoint; di mobile portrait sisi kiri-kanan
  ter-crop. Alasan: crop lebih baik daripada gepeng (distorsi) atau
  letterbox (bar hitam) — komposisi tengah frame tetap terlihat.
- **Overlay gelap `bg-black/50`** (hitam 50%) solid di atas video.
  Alasan: frame video berubah-ubah, kontras teks tidak bisa dijamin per
  frame; 50% hitam membuat teks putih lolos WCAG 4.5:1 di frame seterang
  apa pun. Solid dipilih atas gradient: lebih sederhana dan kontras
  merata di semua posisi teks.
- **Poster: `public/hero-poster.jpg`** (frame pertama video, via ffmpeg).
  Dipakai dua lapis: atribut `poster` di `<video>` + `<img>` di belakang
  video. Alasan: koneksi lambat langsung lihat gambar (bukan kotak
  hitam), dan poster = frame pertama membuat transisi ke video mulus.
- **`prefers-reduced-motion` dihormati via client component kecil**
  (`hero-video.tsx`, `matchMedia` lewat `useSyncExternalStore`): kalau
  user set reduce, elemen `<video>` TIDAK dirender sama sekali — bukan
  sekadar disembunyikan CSS. Alasan: `display:none` tetap mengunduh
  video (2,6MB sia-sia); tidak dirender = tidak diunduh, user dapat
  poster statis. Konsekuensi sadar: video baru muncul setelah hydration
  (celahnya ditutup poster).
- **Tinggi hero `85svh`** (bukan `h-screen`/100vh). Alasan: (1) `svh`
  menghitung viewport mobile dengan URL bar terlihat — `100vh` di mobile
  Safari lebih tinggi dari layar dan bikin lompatan; (2) 85% menyisakan
  intip-an katalog di bawah, isyarat bahwa halaman bisa di-scroll —
  hero full-screen sering dikira "halamannya cuma ini".

**Update 2026-07-05 (2) — scroll-scrubbing (keputusan bersama via opsi):**

- **Video tidak autoplay lagi; progress video terikat scroll** (ala
  landing Apple). Wrapper hero setinggi `300vh`, konten hero `sticky`
  setinggi viewport; scroll 0→100% wrapper = video frame awal→akhir,
  dua arah. Alasan: hero jadi interaktif dan memorable — nilai demo
  portfolio — dan video 10 detik pas untuk ±2 viewport jarak scroll.
- **File terpisah `public/futsal-scrub.mp4`** (4,7MB, H.264 openh264,
  tanpa audio, keyframe tiap 4 frame / `-g 4`). Alasan: mp4 asli cuma
  punya 1 keyframe per 10 detik — `currentTime` seeking harus decode
  dari frame 0 setiap kali = scrub patah-patah. Keyframe rapat = seek
  murah. Trade-off sadar: ukuran naik 2,6→4,7MB demi kehalusan scrub;
  `preload="auto"` kini WAJIB (scrub butuh buffer penuh).
- **Scrub via `requestAnimationFrame` + lerp tanpa library** (bukan GSAP
  ScrollTrigger): logika inti cuma ±30 baris — progress dari
  `getBoundingClientRect`, `currentTime` dikejar pelan (lerp 0.15) biar
  halus. gsap resmi tidak dipakai lagi.
- **`prefers-reduced-motion`**: wrapper kolaps ke `85svh` murni via CSS
  (`motion-safe:` variant), video tetap tidak dirender/diunduh — user
  reduce dapat hero statis normal tanpa pin-scroll.
- **Polish halaman publik (scope keputusan bersama)**: navbar sticky +
  backdrop-blur; katalog card hover lift + ikon lapangan; footer
  sederhana; halaman field & auth dirapikan. Tetap dalam pagar §1–§2:
  shadcn default, satu aksen hijau, tanpa dark mode.

## 3. Peta halaman

| Route | Akses | Isi | Sumber data |
|---|---|---|---|
| `/` | publik | hero video (§2c) + katalog lapangan (card: nama, harga/jam, tombol "Lihat jadwal") | db langsung (Server Component; keputusan 2026-07-04 — HTML jadi di server, tanpa loading flicker; `GET /api/fields` tetap dipakai halaman client) |
| `/fields/[id]` | publik | pilih tanggal → grid slot jam 08–23 → form booking (jam mulai, durasi) | `GET /api/fields/[id]/availability?date=` |
| `/login`, `/register` | publik | form auth | `POST /api/auth/*` |
| `/bookings` | user | daftar booking milik sendiri + badge status + cancel (saat pending) | `GET /api/bookings` |
| `/admin` | admin | tabel booking masuk, aksi approve/reject/complete, filter tanggal/lapangan | `GET /api/admin/bookings` |

Navigasi: navbar sederhana (logo teks kiri; kanan: "Booking Saya" + nama
user + logout kalau login, tombol "Masuk" kalau belum; link "Admin" hanya
untuk role admin). Tanpa sidebar — halamannya cuma 5.

## 4. Komponen shadcn yang dipakai

`button` (sudah ada), `input`, `label`, `card`, `badge`, `table`, `select`,
`sonner` (toast). Ditambah saat dibutuhkan, tidak diborong di depan.

## 5. Pola UX

- **Grid slot jam** (inti aplikasi): tombol per jam 08:00–22:00, tiga
  keadaan — kosong (outline, bisa diklik), terisi (disabled, abu),
  terpilih (aksen hijau). Durasi = pilih jam mulai lalu select durasi;
  slot yang kena rentang ikut ter-highlight. Target sentuh min. 44px.
- **Form**: label selalu terlihat (bukan placeholder-only), error inline di
  bawah field dari pesan API, tombol submit disabled + teks "..." saat
  loading. Setelah sukses: redirect + toast.
- **Konflik booking (409/23P01)**: toast merah dengan pesan API, lalu
  availability di-refresh otomatis — slot yang barusan direbut orang
  langsung kelihatan terisi. Ini momen UX paling penting: race yang
  ditangkap constraint harus terasa "yah keduluan", bukan "aplikasi rusak".
- **State kosong**: tiap daftar punya pesan kosong + aksi ("Belum ada
  booking. Lihat jadwal lapangan →").
- **Aksesibilitas dasar** (tidak ditawar): semua input ber-`<label>`,
  kontras teks ≥ 4.5:1, fokus keyboard kelihatan, tombol slot pakai
  `aria-pressed`.

## 6. Definisi selesai (UI MVP)

- Semua flow SPEC §2 bisa dijalankan dari HP (viewport 375px) tanpa zoom.
- Tidak ada teks Inggris nyasar di UI.
- Lighthouse accessibility ≥ 90 di halaman publik.
