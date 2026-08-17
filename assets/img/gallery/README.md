# Gallery photos

Drop your shop photos in this folder and the website picks them up automatically.

## Preferred: manifest.json

Add an entry to `manifest.json` in this folder. It controls the order and the
alt text, and takes two optional flags:

- `"wide": true` — the photo spans two columns (good for landscape shots)
- `"contain": true` — the photo is shown whole instead of cropped (good for posters)

Any filename works, so you can upload straight from Facebook without renaming.

## Or: numbered files

- Name them `01.jpg`, `02.jpg`, `03.jpg` … up to `12`.
- `.jpg`, `.jpeg`, `.png` and `.webp` all work.
- Portrait shots (4:5) look best — the grid crops to that ratio.
- Keep each file under ~500 KB for fast loading.

Missing numbers are skipped, so you can start with just `01.jpg` and add more later.
Until any photo exists, the site shows styled "photo coming soon" tiles.
