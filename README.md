# Рокса · 25

A birthday "wallpaper" for the living-room TV, with **five interchangeable themes**.

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

Switch with the **dropdown** next to the Test button, with keys **1–5**, or with the links above.
The last choice is remembered on that device. The default for a fresh device is `theme` in `config.js` (currently Kitty).

## Controls

| | |
|---|---|
| **Test** button (bottom-left, fades out when the mouse is idle) or `T` | Starts the 60 s countdown now |
| `Shift+T` | Countdown from 10 s |
| `C` | Skip straight to the celebration |
| `L` | Show the love letter now |
| `F` / double-click / ⛶ | Fullscreen |
| `R` / `Esc` | Back to real time |
| `1`–`5` | Switch theme |

URL options: `?theme=kitty`, `?test`, `?test=10`, `?celebrate`, `?daily` (the countdown runs every night at 23:59). They combine, e.g. `/roksa25/vinyl/?test=10`.

## Editing

Everything personal is in `config.js`: name, date, default theme, photos + captions, the letter, and quotes.
Theme-specific texts (e.g. the Magazine cover lines) are at the top of `themes/<theme>.js`.
To add a photo, drop it into `assets/photos/` and add a line to `PHOTOS`. Portrait, landscape and square photos all work. Please resize big photos first (≈1600 px is plenty for a TV) and remove location data, because the site is public.

## On the night

1. Open the site in a browser on the TV (or on a laptop over HDMI), press `F` for fullscreen and leave the mouse alone.
2. Turn off the TV's screensaver/eco-dimming. The page also asks the browser to keep the screen awake.
3. The countdown starts on its own at 23:59:00 **by the device's clock**, so check that clock first.
