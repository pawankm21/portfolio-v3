# The Margin Notes — portrait prototype

Serve the repository with `python3 -m http.server 4173 --bind 127.0.0.1` and open `/previews/margin-notes/`.

The placeholder is intentionally an illustration, not a likeness of Pawan. It uses the layered portrait idea from the supplied React gaze studio without bringing its editor UI or dependencies into the portfolio.

## Replacing the face

- Replace `assets/portrait-base.svg` with your portrait **without eyes** (SVG or transparent PNG). Change the image src if needed.
- The base and overlay currently share a 320 × 340 coordinate system. Preserve that canvas, or update both viewBox and the coordinate mapping in `portrait.js`.
- Eye centers are (127, 158) and (193, 158). Adjust `data-pupil` coordinates, eye circles, sockets, and clip paths in `index.html` to match your artwork.
- For directional eye sprites, replace the SVG pupil renderer with a sprite layer and reuse the pointer-to-eye coordinate mapping. Prefer pre-cut transparent sprites; no runtime white-background keying is needed.

The pupils are clipped to the eye sockets, move independently, and settle via on-demand animation frames. Tracking resets on pointer exit, window blur, and when offscreen. Touch pointers do not drive gaze. Reduced motion starts with tracking disabled; enabling it uses direct movement without smoothing. The pause control works with keyboard activation.
