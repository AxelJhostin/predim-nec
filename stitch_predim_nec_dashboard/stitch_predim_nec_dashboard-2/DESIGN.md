---
name: Structural Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#5a4138'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#8f7066'
  outline-variant: '#e3bfb2'
  surface-tint: '#a83900'
  primary: '#a43700'
  on-primary: '#ffffff'
  primary-container: '#cd4700'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59a'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cea700'
  on-tertiary-container: '#4e3e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59a'
  on-primary-fixed: '#380d00'
  on-primary-fixed-variant: '#802a00'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#ffe083'
  tertiary-fixed-dim: '#eec200'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#574500'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.02em
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1280px
---

## Brand & Style

The design system is engineered for **PreDim NEC**, a professional tool for structural predimensioning. The brand personality is technical, authoritative, and highly efficient, catering to civil engineers and architects who require precision and speed. 

The aesthetic follows a **Modern SaaS Minimalism** approach. It prioritizes data density and readability over decorative elements. The UI utilizes a structured, card-based layout with a "technical-industrial" feel—achieved through crisp borders, generous whitespace, and a high-contrast color palette that mirrors physical engineering environments (structural steel, blueprints, and safety signage). 

The emotional response should be one of confidence and reliability; the interface feels like a high-performance instrument rather than a casual application.

## Colors

The palette is rooted in industry-standard safety and engineering hues:

- **Primary Structural Orange (#E65100):** Used for primary actions, branding, and highlighting active structural elements. It provides high visibility against both light and dark backgrounds.
- **Engineering Blue (#0284C7):** Used for informational elements, links, and secondary interactive components.
- **Safety Yellow (#FACC15):** Reserved for warnings, critical alerts, and status indicators related to NEC compliance limits.
- **Slate Gray Scale:** A comprehensive range from Slate 50 (backgrounds) to Slate 900 (headlines). 

**Color Mode Support:**
The system is designed for seamless switching. In light mode, surfaces use Slate 50 with thin Slate 200 borders. In dark mode, surfaces shift to Slate 900 with Slate 800 borders. Text contrast must always exceed WCAG AA standards to ensure readability of complex formulas.

## Typography

This design system utilizes **Inter** for all functional UI text due to its exceptional legibility in data-heavy environments. **JetBrains Mono** is introduced as a secondary typeface for mathematical outputs, structural dimensions, and code-based labels to provide a distinct "technical" character to calculated values.

**Usage Rules:**
- **Headlines:** Use Slate 900 (light) or Slate 50 (dark). Heavy weights are reserved for page titles and section headers.
- **Body:** Primarily Slate 600 for high readability over long durations.
- **Labels:** Use JetBrains Mono in all-caps for technical metadata (e.g., "SECTION A-A", "FY 420MPA").
- **Scale:** On mobile devices, `headline-lg` scales down to 24px (`headline-md` equivalent) to prevent overflow in calculation tables.

## Layout & Spacing

The system employs a **4px baseline grid** to ensure mathematical alignment of all elements. 

- **Grid Model:** A 12-column fluid grid for desktop, a 6-column grid for tablets, and a 2-column grid for mobile.
- **Card-Based Architecture:** All structural inputs and results are housed in cards. Cards should span 4 columns (1/3 width) for input groups and 8-12 columns for primary visualization/graphs.
- **Density:** High-density layouts are preferred. Padding inside input cards should be restricted to 16px (4 units) to maximize screen real estate for technical data.
- **Breakpoints:** 
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## Elevation & Depth

To maintain a "Modern SaaS" aesthetic, depth is communicated through **tonal layering** and **subtle outlines** rather than heavy shadows.

- **Surface Levels:** 
  - Level 0 (Background): Slate 50.
  - Level 1 (Cards/Sidebar): White (#FFFFFF) with a 1px border of Slate 200.
  - Level 2 (Modals/Popovers): White with a very soft, diffused shadow (0 4px 6px -1px rgb(0 0 0 / 0.1)).
- **Interactive States:** Hovering over a card or interactive element should increase the border contrast (Slate 300) and slightly shift the background color, rather than increasing shadow depth.
- **Dark Mode:** Elevation is represented by lightening the surface color (Slate 800 for cards on Slate 900 background).

## Shapes

The design system uses a **Soft (0.25rem)** roundedness level to balance the technical "rigidity" of engineering with modern software friendliness.

- **Inputs & Buttons:** 4px (0.25rem) border radius.
- **Cards:** 8px (0.5rem) border radius for a distinct container feel.
- **Data Tags/Chips:** 2px or sharp corners to denote technical metadata.
- **Visualizations:** Graphs and structural diagrams should utilize sharp edges for precision points and soft curves for stress-strain plots.

## Components

### Buttons
- **Primary:** Structural Orange background, White text. High-contrast.
- **Secondary:** Transparent with Slate 200 border, Slate 900 text.
- **Ghost:** No background/border, Engineering Blue text for low-priority actions.

### Input Fields
- **Design:** Label placed above the field in `label-md`. Field background is White (light) or Slate 800 (dark).
- **States:** Focus state uses a 2px Engineering Blue ring. Errors (NEC compliance failures) use a Red 600 border.

### Result Cards
- **Header:** Includes the structural element name (e.g., "Column C1").
- **Body:** Key metrics shown in `data-display` (JetBrains Mono).
- **Footer:** Compliance status badge (Green for "Pass", Yellow for "Warning", Red for "Fail").

### Data Tables
- Use Slate 50 zebra-striping for readability.
- Columns containing numerical values must be right-aligned to allow for quick decimal comparison.

### Navigation
- A vertical sidebar on the left for structural project hierarchy (Project > Floor > Element).
- Clean, monochrome icons from a line-art set (e.g., Lucide or Heroicons).