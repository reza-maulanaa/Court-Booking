// Format rupiah ala prototipe landing: "Rp 50.000" (spasi biasa, tanpa desimal).
// Intl currency memakai spasi sempit non-breaking — beda glyph dari desain.
export function fmtRp(n: number): string {
  return "Rp " + n.toLocaleString("id-ID");
}
