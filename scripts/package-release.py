#!/usr/bin/env python3
"""Create a deterministic source ZIP for a dsh-48mark release using only stdlib."""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUT = ROOT / "dist" / "dsh-48mark-0.1.0.zip"
EXCLUDED_PARTS = {".git", "node_modules", "dist", "coverage", "__pycache__", ".pytest_cache"}
EXCLUDED_NAMES = {".DS_Store", "Thumbs.db"}
EXCLUDED_SUFFIXES = {".pyc", ".pyo", ".log"}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def package_files() -> list[Path]:
    result: list[Path] = []
    for path in ROOT.rglob("*"):
        rel = path.relative_to(ROOT)
        if any(part in EXCLUDED_PARTS for part in rel.parts):
            continue
        if path.name in EXCLUDED_NAMES or path.suffix in EXCLUDED_SUFFIXES:
            continue
        if path.is_symlink():
            raise SystemExit(f"Refusing symlink in package: {rel.as_posix()}")
        if path.is_file():
            if path.name == ".env" or path.name.startswith(".env."):
                raise SystemExit(f"Refusing secret-shaped file: {rel.as_posix()}")
            result.append(path)
    return sorted(result, key=lambda p: p.relative_to(ROOT).as_posix())


def main() -> int:
    out = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_OUT.resolve()
    out.parent.mkdir(parents=True, exist_ok=True)
    files = package_files()
    if not files:
        raise SystemExit("No package files found")
    if out == ROOT or (ROOT in out.parents and "dist" not in out.relative_to(ROOT).parts):
        raise SystemExit("Output inside the project is allowed only under dist/")
    manifest = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    with zipfile.ZipFile(out, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for path in files:
            relative_name = f"dsh-48mark/{path.relative_to(ROOT).as_posix()}"
            info = zipfile.ZipInfo(relative_name, date_time=(2026, 10, 26, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.create_system = 3
            info.external_attr = (0o100644 & 0xFFFF) << 16
            archive.writestr(info, path.read_bytes(), compress_type=zipfile.ZIP_DEFLATED, compresslevel=9)
    digest = sha256(out)
    checksum_path = out.with_suffix(out.suffix + ".sha256")
    checksum_path.write_text(f"{digest}  {out.name}\n", encoding="utf-8")
    print(f"Archive: {out}")
    print(f"Version: {manifest['version']}")
    print(f"Files: {len(files)}")
    print(f"Bytes: {out.stat().st_size}")
    print(f"SHA256: {digest}")
    print(f"Checksum file: {checksum_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
