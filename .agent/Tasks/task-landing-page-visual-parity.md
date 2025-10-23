# Task: Landing Page Visual Parity Notes

## Background
- The product team shared a reference mock (see `codex-clipboard-wzyk2G.png`) that the current landing page should match.
- This document captures every visible detail from the mock so we can scope the changes needed for the Next.js landing page.

## Reference Design Details
- **Header**
  - Top-left logo combines a red, brush-stroke style “M” glyph followed by the word `Merak` in black.
  - Primary navigation sits top-right with links: `Marketplace`, `About Us`, `Log In`; evenly spaced, black text, no separators.
  - Header area uses generous horizontal padding; elements sit on a single baseline aligned near the top edge.
- **Hero Section**
  - Background forms a vertical gradient: bright white at the top fading to a deep maroon at the bottom.
  - A subtle square grid overlays the gradient, most visible in the darker lower half.
  - Main headline copy: `The Intelligent Layer`.
    - “The” and “Layer” in bold black.
    - “Intelligent” in a wide blue-to-red horizontal gradient.
    - Thin vertical tick marks flank the headline on both sides.
  - Subheading just below: `Find, compare, and connect with the tools that fit you.` in medium gray, centered, lighter weight.
- **Prompt Card**
  - Centered rounded rectangle with a soft drop shadow and light warm-gray fill.
  - Placeholder text reads `Ask Merak to hire you your new accountant...` in muted gray.
  - Left inside edge features a circular icon button with a paperclip or link symbol (likely “attach”).
  - Right inside edge features two circular icon buttons side by side: one resembling a voice/soundwave glyph, the other a send arrow.
- **Category Pills**
  - Four pill buttons sit centered beneath the prompt card: `Accountant`, `Customer Support`, `Writing Assistant`, `Researcher`.
  - Pills share the same light warm-gray fill as the card, with subtle inner shadows/borders and white text.
  - Even spacing and alignment follow the card’s width.
- **General Styling**
  - Overall layout is vertically stacked and center-aligned.
  - Typography uses a sans-serif family with bold weights for the headline and regular weights elsewhere.
  - Spacing between sections is generous, producing an airy feel; no visible footer in the mock.

## Next Steps
- Audit the current `app/page.tsx` layout against these notes.
- Gap-analyze typography, spacing, and component styling.
- Plan implementation tasks (layout tweaks, Tailwind tokens, asset updates) once deviations are identified.
