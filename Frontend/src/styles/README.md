# Design System

A custom-made design system with reusable components, proper color palette, typography, and comprehensive design tokens.

## Overview

This design system is built on a **tokens-first architecture** ensuring consistency, scalability, and maintainability across the application.

## Structure

```
styles/
├── index.css              # Main entry point
├── tokens/                # Design tokens (pure values only)
│   ├── colors.css        # Color palette & semantic colors
│   ├── typography.css    # Font system
│   ├── spacing.css       # Spacing scale & layout dimensions
│   ├── motion.css        # Animation & transition timings
│   ├── elevation.css     # Shadows, glows, & depth
│   └── radius.css        # Border radius scale
├── base/                  # Foundation styles
│   ├── reset.css         # Browser normalization
│   └── global.css        # Global element styles
├── components/            # Reusable UI components
│   ├── buttons.css       # Button variants
│   ├── modals.css        # Modal system
│   ├── sidebar.css       # Sidebar navigation
│   ├── cards.css         # Card/panel surfaces
│   ├── forms.css         # Form elements
│   └── avatars.css       # Avatar components
├── utilities/             # Single-purpose helpers
│   ├── layout.css        # Layout utilities
│   ├── spacing.css       # Spacing utilities
│   └── effects.css       # Visual effect utilities
└── game/                  # Game-specific styles (isolated)
    └── pong-4player.css  # 4-player pong game styles
```

## Design Tokens

### Colors
- **Brand**: `--color-primary`, `--color-accent`, `--color-accent-soft`
- **Surfaces**: `--color-surface`, `--color-surface-strong`
- **Borders**: `--color-border-soft`, `--color-border-strong`
- **Navigation**: `--color-navpanel`, `--color-sidebar-*`
- **State**: `--color-danger`, `--color-accent-hover`

### Typography
- **Families**: `--font-family-primary`, `--font-family-accent`, `--font-family-mono`
- **Sizes**: `--font-size-xs` through `--font-size-4xl`
- **Weights**: `--font-weight-normal` through `--font-weight-bold`
- **Line Heights**: `--line-height-tight` through `--line-height-loose`

### Spacing
- **Scale**: `--spacing-0` through `--spacing-20` (0.25rem increments)
- **Layout**: `--header-height`, viewport-relative spacing

### Motion
- **Durations**: `--duration-instant` (50ms) through `--duration-slower` (800ms)
- **Easing**: `--ease-linear`, `--ease-in`, `--ease-out`, `--ease-in-out`, `--ease-smooth`
- **Energy**: `--energy-duration`, opacity variants

### Elevation
- **Shadows**: `--shadow-xs` through `--shadow-2xl`
- **Glows**: `--glow-subtle` through `--glow-intense`
- **Blur**: `--blur-sm` through `--blur-3xl`

### Radius
- **Scale**: `--radius-none` through `--radius-2xl`, `--radius-full`

## Components

All components consume design tokens explicitly. Example:

```css
.button-primary {
  background: var(--color-accent);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-6);
  transition: all var(--duration-fast) var(--ease-out);
  box-shadow: var(--shadow-md);
}
```

### Available Components
- **Buttons**: `.glass-pill`, `.bleed-btn`, `.bleed-btn--hero`
- **Modals**: `.modal-layer`, `.modal-backdrop`, `.modal-panel`, `.modal-close`
- **Sidebar**: `.sidebar-shell`, `.sidebar-link`, `.sidebar-icon-shell`
- **Cards**: `.panel-surface`, `.panel-sheen`, `.panel-halo`
- **Avatars**: `.avatar-shell--tactical`, `.live-dot`

## Utilities

Single-purpose, stateless, non-themed helpers:

- **Layout**: `.u-flex-center`, `.u-grid-center`, `.u-sr-only`
- **Effects**: `.fx-energy`, `.header-surface`, `.logo-mark`, `.hero-orb`

## Usage

Import the main entry point in your application:

```tsx
import './styles/index.css';
```

Or import specific components as needed:

```tsx
import './styles/components/buttons.css';
```

## Design System Principles

1. **Tokens = Pure Values**: Token files contain only CSS custom properties, no selectors
2. **Explicit Consumption**: Components reference tokens explicitly, making the system traceable
3. **Dumb Utilities**: Utilities are single-purpose, structural helpers without theming
4. **Isolation**: Game-specific styles are separated from the core design system

## Summary

We implemented a custom design system based on design tokens (colors, typography, spacing, motion, elevation, radius) and reusable UI components (buttons, modals, sidebar, cards, forms, avatars).

Tokens define all visual constants, components consume tokens, utilities provide single-purpose layout helpers, and game-specific styles are isolated. This ensures consistency, scalability, and maintainability across the application.
