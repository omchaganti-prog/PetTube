#!/usr/bin/env python3
"""
Fix UTF-8 mojibake in PetTube source files.

Root cause: Emojis and Unicode chars were written as cp1252-interpreted
UTF-8 bytes, then re-encoded as UTF-8 (double-encoding).

Fix strategy (per line):
  1. Pre-translate cp1252-specific supplementary chars (U+0178 etc.) back to
     their raw byte equivalents so Latin-1 can encode them.
  2. Encode the line as Latin-1 (bijective 0x00-0xFF mapping).
  3. Decode the resulting bytes as UTF-8 — recovering the original text.
  If either step fails, return the original line unchanged.
"""
import glob
import re

# ── Characters that only appear in emoji / UTF-8 mojibake sequences ────────
MOJIBAKE_MARKERS = {
    '\u00f0',  # ð  — first cp1252 char of any 4-byte emoji (byte F0)
    '\u0178',  # Ÿ  — cp1252 for byte 0x9F (second byte of 4-byte emojis)
    '\u0152',  # Œ  — cp1252 for byte 0x8C
    '\u0160',  # Š  — cp1252 for byte 0x8A
    '\u017d',  # Ž  — cp1252 for byte 0x8E
    '\u00e2',  # â  — first Latin-1 char in text-mojibake sequences (byte E2)
    '\u00c3',  # Ã  — Latin-1 char for byte C3
    '\u00c2',  # Â  — Latin-1 char for byte C2
    '\u0090',  # control char — cp1252 undefined byte 0x90
    '\u009d',  # control char — cp1252 undefined byte 0x9D
    '\u008d',  # control char — cp1252 undefined byte 0x8D
    '\u008f',  # control char — cp1252 undefined byte 0x8F
}

# cp1252 chars that are > U+00FF (can't encode as Latin-1 directly)
# Map them to their raw byte equivalents so Latin-1 can handle them.
CP1252_SUPPL = {
    '\u20ac': '\x80',  # €
    '\u201a': '\x82',  # ‚
    '\u0192': '\x83',  # ƒ
    '\u201e': '\x84',  # „
    '\u2026': '\x85',  # …
    '\u2020': '\x86',  # †
    '\u2021': '\x87',  # ‡
    '\u02c6': '\x88',  # ˆ
    '\u2030': '\x89',  # ‰
    '\u0160': '\x8a',  # Š
    '\u2039': '\x8b',  # ‹
    '\u0152': '\x8c',  # Œ
    '\u017d': '\x8e',  # Ž
    '\u2018': '\x91',  # '
    '\u2019': '\x92',  # '
    '\u201c': '\x93',  # "
    '\u201d': '\x94',  # "
    '\u2022': '\x95',  # •
    '\u2013': '\x96',  # –
    '\u2014': '\x97',  # —
    '\u02dc': '\x98',  # ˜
    '\u2122': '\x99',  # ™
    '\u0161': '\x9a',  # š
    '\u203a': '\x9b',  # ›
    '\u0153': '\x9c',  # œ
    '\u017e': '\x9e',  # ž
    '\u0178': '\x9f',  # Ÿ
}

# ── Correct GROUP_LABELS / GROUP_EMOJIS replacements ───────────────────────
GROUP_LABEL_BLOCK = """\
export const GROUP_LABELS: Record<string, string> = {
  pets:       '\U0001f43e Pets',
  farm:       '\U0001f69c Farm',
  ocean:      '\U0001f30a Ocean',
  birds:      '\U0001f426 Birds',
  wild:       '\U0001f98a Wild',
  exotic:     '\U0001f334 Exotic',
  reptiles:   '\U0001f98e Reptiles',
  amphibians: '\U0001f438 Amphibians',
  baby:       '\U0001f423 Baby',
};"""

GROUP_EMOJI_BLOCK = """\
export const GROUP_EMOJIS: Record<string, string> = {
  pets: '\U0001f43e', farm: '\U0001f69c', ocean: '\U0001f30a', birds: '\U0001f426',
  wild: '\U0001f98a', exotic: '\U0001f334', reptiles: '\U0001f98e', amphibians: '\U0001f438', baby: '\U0001f423',
};"""


def fix_line_roundtrip(line: str) -> str:
    """
    Attempt cp1252→utf-8 round-trip via Latin-1 intermediate.
    Returns original line if the decode doesn't produce valid UTF-8.
    """
    # Pre-translate cp1252 supplementary chars so Latin-1 can encode them
    translated = line
    for char, raw in CP1252_SUPPL.items():
        if char in translated:
            translated = translated.replace(char, raw)
    try:
        fixed = translated.encode('latin-1').decode('utf-8')
        return fixed
    except (UnicodeEncodeError, UnicodeDecodeError):
        return line  # Return the ORIGINAL (not translated) on failure


def fix_file(path: str) -> bool:
    with open(path, 'r', encoding='utf-8') as fh:
        original = fh.read()

    lines = original.split('\n')
    fixed_lines = []
    changed = False

    for line in lines:
        if MOJIBAKE_MARKERS.intersection(line):
            fixed = fix_line_roundtrip(line)
            fixed_lines.append(fixed)
            if fixed != line:
                changed = True
        else:
            fixed_lines.append(line)

    content = '\n'.join(fixed_lines)

    # ── Patch GROUP_LABELS / GROUP_EMOJIS blocks (regex, encoding-safe) ───
    gl_pattern = re.compile(
        r'export const GROUP_LABELS: Record<string, string> = \{[^}]+\};',
        re.DOTALL,
    )
    ge_pattern = re.compile(
        r'export const GROUP_EMOJIS: Record<string, string> = \{[^}]+\};',
        re.DOTALL,
    )

    new_content = gl_pattern.sub(GROUP_LABEL_BLOCK, content)
    if new_content != content:
        changed = True
        content = new_content

    new_content = ge_pattern.sub(GROUP_EMOJI_BLOCK, content)
    if new_content != content:
        changed = True
        content = new_content

    if changed:
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        return True
    return False


def main() -> None:
    files = (
        glob.glob('src/**/*.ts', recursive=True)
        + glob.glob('src/**/*.tsx', recursive=True)
    )
    for path in files:
        if fix_file(path):
            print(f'Fixed: {path}')
    print('Done.')


if __name__ == '__main__':
    main()
