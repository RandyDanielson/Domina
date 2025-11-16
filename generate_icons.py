#!/usr/bin/env python3
"""Generate PNG icons from SVG source in multiple sizes."""

import cairosvg
import os

# Icon sizes to generate
sizes = [16, 32, 48, 128]

# Paths
svg_path = 'icons/icon.svg'
output_dir = 'icons'

print("Generating PNG icons from SVG...")

for size in sizes:
    output_path = os.path.join(output_dir, f'icon{size}.png')
    print(f"  Generating {size}x{size} icon...")

    cairosvg.svg2png(
        url=svg_path,
        write_to=output_path,
        output_width=size,
        output_height=size
    )

    print(f"  ✓ Created {output_path}")

print("\n✨ All icons generated successfully!")
