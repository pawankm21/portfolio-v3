# The Margin Notes

Pawan Mishra's portfolio: Next.js App Router, TypeScript, Tailwind CSS, MDX, and a small SVG portrait interaction. Three primary pages: Home, Projects, Writing. Project and article detail pages are generated from content.

## Run locally

Requires Node.js 22.18+ (Node 24+ recommended).

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The original design study remains in `previews/margin-notes/`.

```sh
npm test
npm run typecheck
npm run build
```

The build exports a static site to `out/`. Serve that directory with any static web server. `npm start` is not used for static exports; run `python3 -m http.server 3000 --directory out --bind 127.0.0.1` to preview production output. Host rewrites must serve the directory index and `404.html` for unknown paths.

## Edit the content

- `lib/profile.ts`: name, contact links, experience, and current topics. Only details from the supplied resume are used. The phone number and original resume PDF are not part of the site.
- `content/projects/*.mdx`: case studies and projects.
- `content/writing/*.mdx`: notes and articles. The initial writing template is an unpublished draft.
- `lib/site.ts`: canonical site origin; update when moving to a personal domain.

Each MDX file needs `title`, `summary`, `topic`, and an explicit `published: true` to appear. Optional fields: `featured`, `status` (`in-progress`, `complete`, `experiment`, `note`), a quoted `date: "YYYY-MM-DD"`, and `related` (slugs in the other collection). Use lowercase hyphenated filenames. Dates can be blank when unknown. Date metadata controls ordering, not claimed project completion dates.

Content is trusted, repository-owned MDX. Do not accept untrusted user-authored MDX: it compiles to executable code. Drafts never generate routes. Set `published: true` and rebuild to publish a note; the writing page and homepage pick it up automatically. Cross-links resolve only published content.

Company mentions are limited to names, positions, and dates in the experience timeline. Project pages cover personal and earlier work.

## Portrait and eye artwork

- `public/portrait/pawan.png`: the supplied eye-free portrait, with its original transparency.
- `public/portrait/eyes/`: separate left and right eye images, named `<direction>_<eye>.png` (20 files for 10 gaze states).
- `components/portrait.tsx`: direction mapping and the `eyes` placement configuration. Each eye has a fixed 158 × 115 footprint on the 1199 × 1312 portrait canvas. Size and spacing are independent.

The eye frames cover eight directions, a neutral gaze, and a cross-eyed gaze when the pointer is near the nose. SVG masks soften the cutout edges without modifying the source files. Each pair shares the same fixed left/right boxes across all gaze states, preventing shifts when a direction changes.

Tracking uses pointer position relative to the portrait, with at most one scheduled frame per update. It resets on window blur and pointer exit, pauses offscreen, ignores touch pointer movement, and starts disabled for reduced motion. There is a keyboard-accessible pause/enable control. Listeners, observers, and scheduled frames clean up on navigation.

## Design and performance

Fonts are bundled locally. Main layouts and MDX render on the server at build time; the portrait and active navigation are the small client components. No animation library is needed for the current interaction. Semantic sections, native disclosure controls, focus outlines, skip navigation, reduced-motion styling, and a custom 404 are included.

A static export has no contact form backend. Contact uses email and social links. There are no fabricated posts, screenshots, testimonials, or project metrics. Actual live Core Web Vitals require production traffic; no benchmark scores are claimed.

## Cloudflare hosting

The site is a Next.js **static export**. Cloudflare serves the generated `out/` files; OpenNext and a Next.js server are not needed.

### Existing Cloudflare Worker (GitHub integration)

- Worker name: `portfolio-v3` (matches `wrangler.jsonc`)
- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Build environment: `NODE_VERSION=24` and `NEXT_PUBLIC_SITE_URL=https://pawanmishra.link`

The explicit assets configuration prevents Wrangler from detecting the project as a server-rendered Next.js app and initiating an OpenNext migration. It preserves trailing-slash routes and serves the generated `404.html` for unknown paths.

Validate packaging without deploying:

```sh
npm run build
npx wrangler deploy --dry-run
```

`wrangler.jsonc` attaches `pawanmishra.link` as the production custom domain when deployed. Cloudflare must have an active zone for that domain in the same account. To attach additional subdomains, add their exact hostnames as `custom_domain: true` routes or use the Worker's **Settings → Domains & Routes → Add → Custom domain**. Check existing DNS records on that hostname before replacing anything. Other subdomains can serve different Workers or applications.

Set `NEXT_PUBLIC_SITE_URL` to the final custom-domain origin. This sets metadata and sitemap URLs at build time; rebuild after changing it. Development defaults to `http://localhost:3000`; production builds default to `https://pawanmishra.link`.

### Alternative: Cloudflare Pages

Connect this repository as a Pages project using the Next.js (Static HTML Export) preset, build command `npm run build`, and output directory `out`. Pages does not use a Wrangler deploy command. Associate custom domains through the Pages project's Custom domains settings.
