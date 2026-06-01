#!/usr/bin/env python3
"""Scan and fix UTF-8 mojibake in PetTube source files."""
import glob

files = (
    glob.glob('src/**/*.ts', recursive=True)
    + glob.glob('src/**/*.tsx', recursive=True)
)

MOJIBAKE_MARKERS = ['â€', '\x90', '\x9c', '\x9d', 'ðŸ', 'â\x80\x9c', 'â"']

for path in files:
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    for i, line in enumerate(content.split('\n'), 1):
        if any(m in line for m in MOJIBAKE_MARKERS):
            print(f'{path}:{i}: {repr(line.strip()[:100])}')
