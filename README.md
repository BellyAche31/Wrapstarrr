# WRAPSTAR. — Website

Static website for **Wrapstar**, a custom motorcycle decal and full-wrap shop in
Coopville, Bagumbong, North Caloocan.

- **Phone:** 0970-098-1295
- **Facebook:** https://www.facebook.com/p/Wrapstarrr-61579585177146/
- **TikTok:** https://www.tiktok.com/@wrapstar08

## Structure

```
index.html            # the whole site (one page)
assets/css/styles.css # styling — black & white, logo-led
assets/js/main.js     # nav, scroll reveals, auto-loading gallery
assets/img/gallery/   # drop your photos here (see the README inside)
```

## Adding photos

Put images in `assets/img/gallery/` named `01.jpg`, `02.jpg`, … `12.jpg`.
The gallery detects them on load — no code changes needed. Details in
`assets/img/gallery/README.md`.

To set the social-share preview image, add `assets/img/og.jpg` (1200×630).

## Editing the text

All copy lives in `index.html`. Phone number appears in the nav CTA, hero,
contact section, and the sticky mobile call bar — search for `9700981295`
if it ever changes.

## Running locally

Any static server works:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000
