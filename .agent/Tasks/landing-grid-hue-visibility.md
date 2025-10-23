# Landing Page Grid & Hue Visibility Investigation
**Date:** 2025-02-14  
**Owner:** Codex Assistant  
**Related route:** `app/page.tsx`  

## Observed Problem
- The landing page background should show a faint grid texture (`/assets/landing/grid-image.svg`) and a radial “hue” glow.
- In the current build both effects are imperceptible in the browser preview and Playwright snapshot.

## Likely Root Causes
1. **Stacking order conflict**
   - Both background layers use negative z-index values (`-z-10`, `-z-20`).  
   - The parent `<main>` still has its own background (`bg-white`). With negative z, the child layers can be painted beneath the parent, effectively hiding them.
2. **Opacity compounded with base gradient**
   - The base gradient layer (`-z-30`, 40–60% opacity) plus the white page background leaves little contrast for the grid, even if it renders.
3. **Grid asset sizing**
   - `object-cover` stretches the SVG, but the file’s light stroke + 0.27 opacity makes it nearly invisible on a white base. Without additional blending or darker base, it disappears.

## Recommended Next Steps
1. **Bring layers into the same stacking context**
   - Set the grid wrapper to `z-0` (or `z-[1]`) and the hue to `z-[-1]`, while giving the main container `bg-transparent` (or removing the static white background).
2. **Add explicit blending / color adjustments**
   - Apply `mix-blend-mode:multiply` or increase the SVG opacity via Tailwind to ensure the texture remains visible.
3. **Update hue styling**
   - After z-index changes, tune opacity/size to match the Figma reference.
4. **Validate with Playwright**
   - Re-run the dev server and Playwright screenshot to confirm both layers are visible before committing.
