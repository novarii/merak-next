# Landing Page Hue Overflow Report
**Date:** 2025-02-23  
**Owner:** Codex Assistant  
**Related route:** `app/page.tsx`  
**Screenshot:** `/tmp/playwright-mcp-output/1761260629224/page-2025-10-23T23-04-32-622Z.png`

## Observation
- Captured via Playwright MCP after masking the grid and moving the hue layer into the content container.
- The radial "hue" glow still bleeds beyond the 1440px content frame in the screenshot. The glow extends outward past the intended bounds while the grid mask fades correctly.

## Likely Causes
1. **Blur radius exceeds the container box**
   - The hue layer lives inside the content wrapper but keeps `blur-[160px]` and `opacity-60`. CSS filters render outside the box, so the blur ignores the parent’s width.
2. **No clipping on the content wrapper**
   - `overflow-visible` (default) on the wrapper lets the glow spill past its edges. Because we removed the page-level white background, the glow stays visible against the viewport gradient.
3. **Hue height still tied to viewport**
   - With `h-[65vh]`, the radial gradient stretches vertically beyond the content, which exaggerates the blur spillover.

## Suggested Next Steps
1. Apply an `overflow-hidden` or a matching `mask-image` to the content wrapper so filtered children stay within bounds.
2. Reduce the blur radius and/or convert the hue layer to use a softer gradient without heavy blur (e.g. bigger spread with `opacity-40`).
3. Replace `h-[65vh]` with a container-relative unit (e.g. `h-[480px]`) and keep it centered so it matches the design glow without overshooting.
4. Re-run the Playwright snapshot once adjustments are in place to confirm the glow no longer bleeds outside the grid bounds.
