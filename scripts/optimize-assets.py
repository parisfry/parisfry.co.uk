#!/usr/bin/env python3
"""Create smaller WebP copies of large raster images in assets/.

Originals are kept. HTML, CSS, and JavaScript references are switched to the
WebP copy only when it is smaller than the original.
"""

from pathlib import Path
import re
import shutil
import subprocess
import sys
import tempfile


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
REFERENCE_EXTENSIONS = {".html", ".css", ".js"}
MIN_SIZE_BYTES = 1_000_000
MAX_DIMENSION = 3000
QUALITY = 92


def dimensions(path: Path) -> tuple[int, int] | None:
    sips = shutil.which("sips")
    if not sips:
        return None
    result = subprocess.run(
        [sips, "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode:
        return None
    values = re.findall(r"(?:pixelWidth|pixelHeight):\s*(\d+)", result.stdout)
    return (int(values[0]), int(values[1])) if len(values) == 2 else None


def encode(source: Path, destination: Path) -> bool:
    cwebp = shutil.which("cwebp")
    if cwebp:
        result = subprocess.run(
            [cwebp, "-quiet", "-q", str(QUALITY), "-resize", str(MAX_DIMENSION), str(MAX_DIMENSION), str(source), "-o", str(destination)],
            capture_output=True,
            check=False,
        )
        if result.returncode == 0 and destination.exists():
            return True

    ffmpeg = shutil.which("ffmpeg")
    if ffmpeg:
        result = subprocess.run(
            [ffmpeg, "-y", "-loglevel", "error", "-i", str(source), "-vf", f"scale='min({MAX_DIMENSION},iw)':'min({MAX_DIMENSION},ih)':force_original_aspect_ratio=decrease", "-c:v", "libwebp", "-quality", str(QUALITY), "-compression_level", "6", str(destination)],
            capture_output=True,
            check=False,
        )
        if result.returncode == 0 and destination.exists():
            return True
    return False


def update_references(source: Path, webp: Path) -> int:
    # Match the full assets-relative path so same-named files in other project
    # folders are never changed accidentally.
    old_path = re.escape(source.relative_to(ROOT).as_posix())
    pattern = re.compile(old_path)
    replacements = 0
    for file in ROOT.rglob("*"):
        if not file.is_file() or file.suffix.lower() not in REFERENCE_EXTENSIONS:
            continue
        if "assets" in file.parts and file != source:
            continue
        try:
            contents = file.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue
        updated, count = pattern.subn(webp.relative_to(ROOT).as_posix(), contents)
        if count:
            file.write_text(updated, encoding="utf-8")
            replacements += count
    return replacements


def main() -> int:
    if not ASSETS.is_dir():
        print("Could not find the assets/ folder.", file=sys.stderr)
        return 1
    candidates = 0
    converted = 0
    for source in ASSETS.rglob("*"):
        if not source.is_file() or source.suffix.lower() not in IMAGE_EXTENSIONS:
            continue
        size = source.stat().st_size
        dims = dimensions(source)
        if size < MIN_SIZE_BYTES and not (dims and max(dims) > MAX_DIMENSION):
            continue
        candidates += 1
        webp = source.with_suffix(".webp")
        if webp.exists() and webp.stat().st_mtime >= source.stat().st_mtime:
            print(f"Already optimized: {source.relative_to(ROOT)}")
            continue

        with tempfile.NamedTemporaryFile(suffix=".webp", dir=source.parent, delete=False) as temp:
            temp_path = Path(temp.name)
        try:
            if not encode(source, temp_path):
                print(f"Skipped (install cwebp or ffmpeg): {source.relative_to(ROOT)}", file=sys.stderr)
                continue
            if temp_path.stat().st_size >= size:
                print(f"Kept original (WebP was not smaller): {source.relative_to(ROOT)}")
                continue
            temp_path.replace(webp)
            changed_refs = update_references(source, webp)
            converted += 1
            print(f"Optimized {source.relative_to(ROOT)} → {webp.relative_to(ROOT)}; updated {changed_refs} reference(s)")
        finally:
            temp_path.unlink(missing_ok=True)

    if not candidates:
        print("No large images found (threshold: 1 MB or over 3000 px).")
    elif not converted:
        print("No new WebP files were needed; originals were left untouched.")
    print("Original images are always kept.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
