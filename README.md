# Рокса · 25

A birthday "wallpaper" for the living-room TV, with **six interchangeable themes**.

All themes share the same show:
- **Before midnight:** a wallpaper with her name and a live clock.
- **23:59:00 on 3 November:** a 60-second countdown. In the last 10 seconds it says *загадай бажання* ("make a wish").
- **00:00:** the celebration (fireworks or confetti, the name, 25, photo cards and quotes) stays on for the whole day. Photos start right away; ~1 min later the love letter writes itself (photos pause), stays 10 s after the last word, then the photos continue. After a full round of photos the letter returns once more.

## Themes

| Theme | Link | Look |
|---|---|---|
| 🌸 Classic | `/roksa25/classic/` | dark moody bloom: peonies, lilies, polaroids, fireworks |
| 🍭 Dopamine | `/roksa25/dopamine/` | bright colour blocks, stickers, the screen flips colour every second, confetti cannons |
| 🐱 Kitty | `/roksa25/kitty/` | pink cartoon: peeking & sleeping cats, cat-face countdown, cake with 2 and 5 candles, hearts & paws |
| 📰 Magazine | `/roksa25/magazine/` | dark editorial cover: giant masthead, cover photo, cover lines, lime "25" sticker |
| 💿 Vinyl | `/roksa25/vinyl/` | record club: the record leaves its sleeve, the tonearm crosses it during the countdown, the needle drops at midnight |
| 🏢 Office | `/roksa25/office/` | mockumentary: memo on the office wall, Kevin's chili, "World's Best" mug, whiteboard countdown with Dwight facts, corkboard award party, quotes as TV subtitles |

- `/roksa25/` always opens **Kitty** (set by `theme` in `config.js`).
- Every theme has its own address: `/roksa25/vinyl/` or `/roksa25/?theme=vinyl`, so each screen can show a different one.
- `/roksa25/test/` is the same site **with test buttons**: theme picker, ▶ 60s / 20s / 10s countdowns, 🎉 celebration, 💌 letter, ↺ back to real time.
  The normal addresses show no buttons, and keyboard shortcuts work only on the test page (except `F` for fullscreen).
  The test page always opens in the idle state with the live clock (even on 4 November); there every midnight counts as the birthday.

## URL options

| | |
|---|---|
| `?theme=vinyl` | pick a theme |
| `?test=20` | start a countdown from 20 s on load (any 3–60), e.g. `/roksa25/dopamine/?test=15` |
| `?celebrate` | open straight in the celebration |
| `?daily` | run the countdown every night at 23:59 |

Test-page keys: `T` = 20 s test, `Shift+T` = 60 s, `C` = celebrate, `L` = letter, `R` = real time, `1`–`5` = theme, `F` = fullscreen.

## Editing

**Photo titles:** open **`/roksa25/gallery/`**, change the titles (or untick «показувати» to hide a photo),
press **Скопіювати photos.js**, then **Відкрити photos.js на GitHub** → select all → paste → **Commit changes**.
The site updates by itself in ~1–2 minutes.

**Letter, quotes, timings:** `config.js` on GitHub → ✏️ → edit → **Commit changes**.

Theme-specific texts (e.g. the Magazine cover lines) are at the top of `themes/<theme>.js`.
To add a photo, put it in `assets/photos/` and add a line to `PHOTOS`. Resize big photos first (≈1600 px is plenty) and remove location data, because the site is public.

## On the night

1. Open the site in a browser on the TV (or on a laptop over HDMI), press `F` for fullscreen and leave the mouse alone.
2. Turn off the TV's screensaver/eco-dimming. The page also asks the browser to keep the screen awake.
3. The countdown starts on its own at 23:59:00 **by the device's clock**, so check that clock first.
