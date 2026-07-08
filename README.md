# Personal Portfolio Website — CloudExify Web Dev Month 1, Project 1

A frontend static portfolio built with **HTML5, CSS3, and vanilla JavaScript** — no
frameworks, no build step. Deploys to Vercel with zero configuration.

## Submission details

| Field | Value |
|-------|-------|
| **Name** | Asiya Khan |
| **Registration number** | `CX-2026-XXXX` _(replace with yours)_ |
| **Build track** | Dark developer aesthetic (navy gradient, purple + amber accents) |
| **Signature features** | Live theme switcher · Scroll-triggered skill bars · Live project filter · Hidden easter egg (Konami code) |
| **Live Vercel link** | `https://cloudexify-web-p1-asiya.vercel.app` _(replace after deploy)_ |

## Features implemented

- **Live theme switcher** — dark by default (matching the design), toggles to light, saved via `localStorage`.
- **Scroll motion** — sections, cards, and tech tiles fade + slide in on scroll (staggered), with a right-rail section counter (00–04) that tracks your position, parallax decorative shapes, and a condensing navbar.
- Responsive hamburger navbar (mobile-first, animated icon, closes on link tap).
- Contact form with client-side validation (real backend arrives in Month 2).
- Reduced-motion support for accessibility.

## Projects featured (3)

1. Study Planner Application — React Native (Expo), Node.js, MongoDB (Full-Stack) — [code](https://github.com/asiyayarkhan15-a11y/study-planner-v3)
2. Purrfect Care — Pet Care App — React Native (Expo), TypeScript, Firebase (Mobile) — [code](https://github.com/asiyayarkhan15-a11y/purrfect-care)
3. QuickBite — Food Delivery App — React Native (Expo), Firebase, REST APIs (Mobile) — [code](https://github.com/asiyayarkhan15-a11y/Quickbite)

## Project structure

```
portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── resume.pdf
└── README.md
```

## Run locally

Open `index.html` in a browser, or use a static server:

```bash
npx serve .
```

## Deploy to Vercel

1. Push this folder to a GitHub repo named `cloudexify-web-p1-asiya`.
2. On [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Framework preset: **Other** (static site, no build command).
4. **Deploy** → copy the `*.vercel.app` link into the table above.

Every future `git push` auto-redeploys.

## TODO before submitting

- [ ] Add real **Live** and **Code** links to each project (currently `#`).
- [ ] Update GitHub / LinkedIn links in the footer.
- [ ] Add 2 screenshots (desktop + mobile) to the repo.
- [ ] Fill in your registration number and live Vercel link above.
