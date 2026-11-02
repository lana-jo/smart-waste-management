"""Render ERD Phase 1 Smart Waste Management System ke PNG dengan Pillow.

Cara pakai (venv terpisah di /tmp/opencode/docvenv, bukan venv backend):
    /tmp/opencode/docvenv/bin/python docs/generate_erd.py

Sumber struktur: docs/init_snapshot.sql + docs/erd.dbml (PRD section 3.4).
Struktur tabel ditulis literal agar output PNG deterministik dan bisa diulang;
perubahan skema harus disinkronkan ke konstanta di bawah ini.
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent.parent / "docs"
OUTPUT = BASE / "erd.png"

W, H = 1240, 800
BG = (255, 255, 255)
INK = (0, 0, 0)
MID = (80, 80, 80)
ACCENT = (60, 60, 60)
TITLE_BG = (232, 236, 241)

FONT_DIR = Path("/usr/share/fonts/truetype/dejavu")

# Kolom: (nama, tipe, tanda). PK diberi underline, FK diberi "FK".
USERS = [
    ("id", "uuid", "PK"),
    ("name", "varchar(100)", ""),
    ("email", "varchar(100) UNIQUE", ""),
    ("password_hash", "varchar(255)", ""),
    ("role", "varchar(20) DEFAULT 'user'", "admin | user"),
    ("created_at", "timestamp", ""),
]
REPORTS = [
    ("id", "uuid", "PK"),
    ("user_id", "uuid -> users.id", "FK"),
    ("image_url", "text", ""),
    ("category", "varchar(50)", "Organic | Plastic | Paper"),
    ("confidence", "float DEFAULT 0.0", ""),
    ("description", "text", ""),
    ("latitude", "decimal(10,8)", ""),
    ("longitude", "decimal(11,8)", ""),
    ("status", "varchar(30) DEFAULT 'Pending'", "4 status"),
    ("created_at", "timestamp", ""),
    ("updated_at", "timestamp", ""),
]


def load_font(name, size):
    """Muat font DejaVu; fallback ke font ttf sistem lain bila path utama absen."""
    candidates = [FONT_DIR / name, FONT_DIR / "DejaVuSans.ttf"]
    if not FONT_DIR.exists():
        other = sorted(Path("/usr/share/fonts").rglob("*.ttf"))
        candidates = list(islice(other, 3))
    for path in candidates:
        if path.exists():
            return ImageFont.truetype(str(path), size)
    raise RuntimeError("Tidak ada font TTF di /usr/share/fonts")


def geom(box_x, box_y, box_w, title_h, rows):
    """Kembalikan tinggi kotak entitas dan posisi-y tiap baris kolom."""
    row_h = 34
    height = title_h + len(rows) * row_h + 14
    line_ys = [box_y + title_h + i * row_h + row_h // 2 for i in range(len(rows))]
    return height, row_h, line_ys


def draw_entity(img, draw, label, columns, x, y, w, font, font_title, note_font):
    """Gambar satu kotak entitas: judul + daftar kolom bertipe."""
    title_h = 48
    height, row_h, line_ys = geom(x, y, w, title_h, columns)
    draw.rectangle([x, y, x + w, y + height], outline=INK, width=3)
    draw.rectangle([x, y, x + w, y + title_h], fill=TITLE_BG, outline=INK, width=3)
    tw = draw.textlength(label, font=font_title)
    draw.text((x + (w - tw) / 2, y + 10), label, fill=INK, font=font_title)
    for (fname, ftype, mark), ly in zip(columns, line_ys):
        draw.line([x, ly - row_h // 2, x + w, ly - row_h // 2], fill=MID, width=1)
        name = f"{fname} : {ftype}"
        draw.text((x + 14, ly - 9), name, fill=INK, font=font)
        if mark:
            mw = draw.textlength(mark, font=note_font)
            draw.text((x + w - mw - 12, ly - 8), mark, fill=ACCENT, font=note_font)
        if mark == "PK":
            nw = draw.textlength(fname, font=font)
            draw.line([x + 13, ly + 10, x + 15 + nw, ly + 10], fill=INK, width=2)
    return y + height, line_ys


def draw_relation(draw, from_xy, to_xy, font, note_font, label):
    """Gambar garis FK berpanah dari waste_reports.user_id menuju users.id.

    to_xy harus tepat di tepi kanan kotak users; from_xy di tepi kiri kotak
    waste_reports. Label dan keterangan 1:N diletakkan di celah antar kotak.
    """
    x0, y0 = from_xy          # sisi banyak (waste_reports.user_id)
    x1, y1 = to_xy            # sisi satu (users.id)
    mid_x = (x0 + x1) / 2
    draw.line([x0 - 4, y0, mid_x, y0], fill=ACCENT, width=3)
    draw.line([mid_x, y0, mid_x, y1], fill=ACCENT, width=3)
    draw.line([mid_x, y1, x1 + 16, y1], fill=ACCENT, width=3)
    # Kepala panah segitiga mengarah ke users.id (satu).
    draw.polygon([(x1 + 16, y1 - 7), (x1 + 16, y1 + 7), (x1, y1)], fill=ACCENT)
    draw.ellipse([x0 - 6, y0 - 6, x0 + 6, y0 + 6], fill=ACCENT)
    tx = mid_x - 135
    draw.text((tx, y1 - 42), label, fill=INK, font=font)
    draw.text(
        (tx, y0 + 16),
        "1 : N - satu user (1) memiliki banyak laporan (N).",
        fill=ACCENT,
        font=note_font,
    )


def main():
    draw_font = load_font("DejaVuSans.ttf", 15)
    font_title = load_font("DejaVuSans-Bold.ttf", 17)
    font_h1 = load_font("DejaVuSans-Bold.ttf", 22)
    note_font = load_font("DejaVuSans.ttf", 12)

    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    head = "ERD - Smart Waste Management System (Phase 1)"
    d.text((24, 18), head, fill=INK, font=font_h1)
    d.text(
        (24, 52),
        "PRD section 3.4 - skema init_snapshot.sql - dua tabel inti, relasi 1:N.",
        fill=ACCENT,
        font=note_font,
    )

    ux, uy, uw = 60, 130, 380
    rx, ry, rw = 790, 130, 420
    users_bottom, users_ys = draw_entity(
        img, d, "users", USERS, ux, uy, uw, draw_font, font_title, note_font
    )
    reports_bottom, reports_ys = draw_entity(
        img, d, "waste_reports", REPORTS, rx, ry, rw, draw_font, font_title, note_font
    )

    reports_user_id_y = reports_ys[1]  # baris kedua REPORTS = kolom user_id
    draw_relation(
        d,
        (rx, reports_user_id_y),
        (ux + uw, users_ys[0]),
        draw_font,
        note_font,
        "waste_reports.user_id  >  users.id",
    )

    lowest = max(users_bottom, reports_bottom)
    d.text(
        (24, lowest + 46),
        "Keterangan relasi: waste_reports.user_id adalah FK; satu user dapat "
        "mengirim banyak laporan; setiap laporan persis satu user (NOT NULL).",
        fill=INK,
        font=note_font,
    )
    d.text(
        (24, lowest + 70),
        "Render ulang: /tmp/opencode/docvenv/bin/python docs/generate_erd.py "
        "(sumber: docs/init_snapshot.sql, docs/erd.dbml).",
        fill=MID,
        font=note_font,
    )

    img.save(OUTPUT)
    print(f"Tersimpan: {OUTPUT} ({img.width}x{img.height}px)")


if __name__ == "__main__":
    main()
