# XPLA DEV Utils Design System

## Product Context

XPLA DEV Utils is a developer-facing operational web app for day-to-day chain work.
It is not a marketing site. Users come here to inspect endpoints, query chain state,
move between utilities quickly, and make technical decisions with minimal friction.

## Design Direction

Name: `Operator Grid`

The product should feel like a calm command surface:

- scan-first rather than decoration-first
- high information clarity without feeling cramped
- neutral by default, accent only when it carries meaning
- strong distinction between navigation, controls, and data
- consistent enough that every page feels related, but flexible enough for tools with very different jobs

## Core Principles

1. Interfaces must be readable in under three seconds.
2. Typography should clarify hierarchy before color does.
3. Color is reserved for actions, status, and meaning.
4. Surfaces are layered with subtle tone and border contrast, not heavy ornament.
5. Motion should confirm interaction, never compete with data.

## Color Tokens

### Light

- Background: `#F4F7FA`
- Surface: `#FFFFFF`
- Surface Alt: `#ECF1F5`
- Foreground: `#18212B`
- Muted Text: `#5A6978`
- Border: `#D4DEE7`
- Primary: `#0E7490`
- Primary Hover: `#0A6178`
- Primary Soft: `#D9F0F4`
- Success: `#15803D`
- Warning: `#B45309`
- Error: `#B91C1C`

### Dark

- Background: `#0D141B`
- Surface: `#111B24`
- Surface Alt: `#16222D`
- Foreground: `#E8EEF3`
- Muted Text: `#93A3B4`
- Border: `#253545`
- Primary: `#4CC3D9`
- Primary Hover: `#6FD4E6`
- Primary Soft: `#103540`

## Typography

### Font Stacks

- Sans: `"Aptos", "Segoe UI Variable", "Noto Sans KR", "Apple SD Gothic Neo", sans-serif`
- Mono: `"IBM Plex Mono", "SFMono-Regular", "Menlo", "Consolas", monospace`

### Rules

- Headlines are short, dense, and left aligned
- Small labels use mono, uppercase, and wider tracking
- Buttons use sentence case for speed, not all caps
- Numeric data should align visually and avoid ornamental fonts

## Spacing

- Base rhythm: `8px`
- Compact controls: `32-36px`
- Standard controls: `40px`
- Card padding: `20-24px`
- Section gaps: `24px`, `32px`, `40px`

## Shape and Borders

- Radius: medium, never bubbly
- Borders are `1px` in most cases
- Strong emphasis can use `2px`, but only for active or primary surfaces

## Motion

- Default transitions: `120-160ms`
- Hover movement should stay subtle
- No theatrical entrance animations on data-heavy views

## Component Rules

### Header

- Sticky, quiet, readable
- Navigation is compact and obvious
- Active state uses fill plus border, not novelty

### Hero

- A page hero should orient the user fast:
  - what page this is
  - what they can do here
  - the first one or two useful actions
- Avoid oversized marketing copy

### Cards

- Cards are functional containers, not decorative frames
- Headers should expose context and labels
- Footers should carry live state, timestamps, or low-priority metadata

### Status Surfaces

- Endpoint status needs both trend memory and current state
- Success and failure colors are semantic exceptions, not theme accents
- Timestamps and metrics belong in fixed, low-noise positions

## Page Patterns

### Home

- First row: orientation and key shortcuts
- Second row onward: live operational data grouped by network

### Utility Pages

- Hero at top
- Primary tool immediately visible
- Advanced or raw data below

## Anti-Patterns

- Decorative serif display typography on operational pages
- Oversized hero sections that push tools below the fold
- Full monochrome with no semantic accent for status or action
- Overusing uppercase on interactive controls
- Thick borders everywhere with no hierarchy
