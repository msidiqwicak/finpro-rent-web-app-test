---
name: Evergreen Escapes
colors:
  surface: '#f9faf8'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f2'
  surface-container: '#edeeec'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e1e3e1'
  on-surface: '#191c1b'
  on-surface-variant: '#434843'
  inverse-surface: '#2e3130'
  inverse-on-surface: '#f0f1ef'
  outline: '#737973'
  outline-variant: '#c3c8c1'
  surface-tint: '#4d6453'
  primary: '#061b0e'
  on-primary: '#ffffff'
  primary-container: '#1b3022'
  on-primary-container: '#819986'
  inverse-primary: '#b4cdb8'
  secondary: '#56642b'
  on-secondary: '#ffffff'
  secondary-container: '#d6e7a1'
  on-secondary-container: '#5a682f'
  tertiary: '#111910'
  on-tertiary: '#ffffff'
  tertiary-container: '#252e23'
  on-tertiary-container: '#8c9687'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d0e9d4'
  primary-fixed-dim: '#b4cdb8'
  on-primary-fixed: '#0b2013'
  on-primary-fixed-variant: '#364c3c'
  secondary-fixed: '#d9eaa3'
  secondary-fixed-dim: '#bdce89'
  on-secondary-fixed: '#161f00'
  on-secondary-fixed-variant: '#3e4c16'
  tertiary-fixed: '#dce6d5'
  tertiary-fixed-dim: '#c0c9ba'
  on-tertiary-fixed: '#151e14'
  on-tertiary-fixed-variant: '#40493d'
  background: '#f9faf8'
  on-background: '#191c1b'
  surface-variant: '#e1e3e1'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
---

## Brand & Style
The brand personality is rooted in environmental stewardship, tranquility, and refined exploration. It targets the "conscious traveler"—individuals seeking high-quality, nature-integrated accommodations without sacrificing professional reliability. 

The design style is **Modern Organic**. It merges the clean efficiency of a corporate booking platform with the soft, tactile qualities of the natural world. By utilizing a specific "soft-minimalism" approach, the UI prioritizes breathability and calm interactions. The emotional response should be one of immediate decompression, as if the user has already stepped into a forest retreat. Visuals are characterized by generous whitespace, subtle depth, and a complete absence of harsh, aggressive angles.

## Colors
The palette is a sophisticated monochrome-adjacent system centered on botanical hues. 

- **Primary (Forest Green):** Reserved for high-priority actions, navigation headers, and grounding elements. It provides the "professional" weight of the system.
- **Secondary (Moss Green):** Used for highlighting eco-features, badges, and secondary calls to action. It represents growth and vitality.
- **Tertiary (Soft Sage):** The primary background foundation. It is less clinical than pure white, reducing eye strain and reinforcing the organic theme.
- **Accent (Deep Leaf):** Used sparingly for interactive states like hover effects or success indicators.
- **Neutral (Pebble):** Used for subtle borders and surface layering to distinguish between different content zones.

## Typography
The typographic pairing balances approachability with clarity. 

**Plus Jakarta Sans** is used for headers to provide a friendly, rounded geometry that feels contemporary and welcoming. Its soft terminals mirror the rounded corners of the UI components.

**Manrope** is utilized for all body copy and functional labels. It was selected for its exceptional legibility and structured, professional tone. To maintain a rhythmic hierarchy, headlines should use tighter letter spacing, while small labels benefit from slight tracking increases to ensure accessibility against colored backgrounds.

## Layout & Spacing
The design system employs a **fixed-center grid** for desktop and a **fluid grid** for mobile devices. 

- **Desktop (1280px+):** A 12-column grid with 24px gutters. Content is centered with generous outer margins to evoke a sense of "breathing room."
- **Tablet (768px - 1024px):** An 8-column grid. Side margins reduce to 32px.
- **Mobile (<768px):** A 4-column grid. Vertical stack patterns are preferred to maintain high legibility for property details.

Spacing follows a strict 8px base unit. Component internal padding should favor "airy" vertical spacing (e.g., 16px top/bottom, 24px left/right) to prevent the interface from feeling cluttered or "squeezed."

## Elevation & Depth
This design system uses **Ambient Shadows** and **Tonal Layering** to define hierarchy. 

Shadows are never pure black; they are tinted with the primary Forest Green (#1B3022) at very low opacities (4-8%). This creates a "natural light" effect rather than a digital one. 

- **Level 0 (Floor):** The Soft Sage background.
- **Level 1 (Card):** White or slightly lighter Sage surfaces with a 1px "Pebble" border or a very soft, diffused shadow (Y: 4px, Blur: 12px).
- **Level 2 (Interactive/Floating):** Used for navigation bars and active filters. Features a more pronounced shadow (Y: 8px, Blur: 24px) to suggest elevation above the content.

Backdrop blurs (10px - 15px) are applied to sticky navigation headers to maintain a sense of translucency and environmental continuity as the user scrolls.

## Shapes
The shape language is defined by a **Rounded (Level 2)** philosophy. There are no sharp 90-degree corners in the system, as they feel too aggressive for a tranquil travel brand.

- **Standard Buttons & Inputs:** 0.5rem (8px) corner radius.
- **Content Cards:** 1rem (16px) corner radius.
- **Imagery:** Large property photos should utilize the 1.5rem (24px) radius to emphasize the "escape" feel.
- **Selection Indicators:** Use pill-shapes for search tags and filters to create a distinct visual contrast against rectangular content blocks.

## Components
- **Buttons:** Primary buttons use the Forest Green background with white text. Secondary buttons use a Moss Green outline with Forest Green text. All buttons feature a subtle 2px lift on hover.
- **Cards:** Property cards are the centerpiece. They feature a "soft-edge" image at the top, followed by a padded section for details. The price is anchored at the bottom right in a bolded Forest Green.
- **Input Fields:** Search inputs should feel substantial. Use a white background, Pebble-colored border, and 16px internal padding. Focus states transition the border to Moss Green.
- **Eco-Badges:** A custom component—small, pill-shaped chips with a light Moss Green background and a tiny leaf icon—used to highlight sustainable property features (e.g., "Solar Powered," "Zero Waste").
- **Date Pickers:** Should use a clean, non-bordered layout with a Soft Sage highlight for the selected date range, keeping the interface minimal and focused.
- **Lists:** Use custom bullet points styled as small Moss Green circles or leaf icons to reinforce the organic theme.