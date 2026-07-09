# Joe Mama Website

Modern, mobile-first React website for **Joe Mama**, a healthy food business in Laoag City serving fresh, high-protein, affordable meals.

The site is built as a Vite + React single-page app with Tailwind CSS utility styling, Lucide icons, local food photos, smooth reveal animations, menu filtering, gallery lightbox, contact details, and a feedback UI.

## Features

- Premium responsive restaurant landing page
- Sticky glass-style navigation with mobile menu
- Hero section using the local `landingPagePhoto.png`
- Featured menu with category filters and search
- Local food images from `src/pictures`
- Messenger-focused ordering CTAs instead of cart checkout
- Why choose, ordering steps, reviews, gallery, FAQ, contact, and footer sections
- Feedback form with validation and visible submitted comments for the current session
- Dark mode toggle
- Floating Facebook/Messenger and back-to-top buttons

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Lucide React
- PostCSS + Autoprefixer

## Requirements

Install Node.js first:

```text
https://nodejs.org/
```

Then install project dependencies from the project folder.

## Run Locally

Open a terminal in:

```powershell
C:\JOEWEBSITE
```

Install dependencies:

```powershell
npm.cmd install
```

Start the development server:

```powershell
npm.cmd run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Use `npm.cmd` on this Windows machine because PowerShell may block the `npm.ps1` shim through execution policy.

## Useful Commands

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

`npm.cmd run build` creates the production files inside `dist/`.

## Project Structure

```text
C:\JOEWEBSITE
  index.html
  package.json
  README.md
  postcss.config.js
  tailwind.config.js
  src
    App.jsx
    main.jsx
    styles.css
    pictures
      Beef RiceBowl.png
      Beef Salad.png
      Chicken Rice Bowl.png
      ChickenSalad.png
      Fresh Lumpia.png
      landingPagePhoto.png
      logo.png
      menu.jpg
```

## Main Files

- `src/App.jsx` - main website UI and page sections
- `src/main.jsx` - React entry point
- `src/styles.css` - Tailwind CSS imports and base styles
- `src/pictures/` - local brand and food images
- `index.html` - page shell and SEO metadata
- `tailwind.config.js` - Tailwind content scanning
- `postcss.config.js` - Tailwind/PostCSS setup

## Updating Photos

Place replacement images in:

```text
src/pictures
```

If the filename changes, update the import near the top of `src/App.jsx`.

Current expected filenames:

- `logo.png`
- `landingPagePhoto.png`
- `ChickenSalad.png`
- `Beef Salad.png`
- `Chicken Rice Bowl.png`
- `Beef RiceBowl.png`
- `Fresh Lumpia.png`
- `menu.jpg`

## Feedback Notes

The feedback section is currently frontend-only:

- New comments appear immediately after submission
- Comments are stored only in React state
- Comments disappear after refresh
- Other visitors will not see them yet

For public realtime comments, connect the feedback form to a backend/database such as Firebase, Supabase, or a custom API.

## Deployment

Build the site:

```powershell
npm.cmd run build
```

Deploy the generated `dist/` folder to a static hosting service such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages.

## SEO

SEO metadata is in `index.html`, including the description and healthy-food keywords for Laoag and the Philippines.
