---
name: Polarist Sutil
version: alpha
colors:
  primary: "#CAFE5B"      # Verde Polarist (Acento)
  background: "#010101"   # Deep Black
  surface: "#111111"      # Glass/Bento foundation
  text: "#F6F6F6"         # White Off
  text-muted: "rgba(246,246,246,0.5)"
typography:
  h1:
    fontFamily: Arno Pro
    fontWeight: 300
    fontSize: 52px
  h2:
    fontFamily: Arno Pro
    fontWeight: 400
    fontSize: 36px
  body:
    fontFamily: Sequel Sans
    fontWeight: 400
    fontSize: 15px
  label:
    fontFamily: Sequel Sans
    fontWeight: 400
    fontSize: 10px
    letterSpacing: 4px
rounded:
  sm: 8px
  md: 14px
  lg: 24px
  pill: 999px
spacing:
  sm: 14px
  md: 40px
  lg: 80px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.pill}"
    padding: "13px 26px"
  card-bento:
    backgroundColor: "rgba(255, 255, 255, 0.02)"
    rounded: "{rounded.lg}"
    padding: "40px"
---

## Overview

Polarist "Sutil" is a high-end design system blending corporate authority (Serif) with AI disruption (Neon Green).

## Colors

- **Primary (#CAFE5B)**: The driving force of innovation. Used for CTAs and highlights.
- **Background (#010101)**: Absolute focus and depth.

## Typography

- **Arno Pro**: Used for storytelling and high-level headings.
- **Sequel Sans**: Used for technical data, labels, and interaction.

## Shapes

All interactive containers should use the Bento radius (14px or 24px) with subtle glass effects.
