# Design System

A custom tokens-first design system used across the frontend.

## Structure

```
styles/
├── index.css              # Main entry point
├── tokens/                # Design tokens (pure values only)
│   ├── colors.css
│   ├── typography.css
│   ├── spacing.css
│   ├── motion.css
│   ├── elevation.css
│   ├── radius.css
│   └── index.css
├── base/                  # Foundation styles
│   ├── reset.css
│   └── global.css
├── components/            # Reusable UI components
│   ├── buttons.css
│   ├── modals.css
│   ├── sidebar.css
│   ├── cards.css
│   ├── forms.css
│   ├── avatars.css
│   ├── browser-kit.css
│   ├── contact.css
│   └── legal.css
├── utilities/             # Single-purpose helpers
│   ├── layout.css
│   ├── spacing.css
│   └── effects.css
└── game/                  # Game-specific styles
    └── pong-4player.css
```

## Design Tokens

Tokens are CSS custom properties grouped by category:

- Colors: brand, surfaces, borders, state
- Typography: families, sizes, weights, line-heights
- Spacing: layout spacing and scales
- Motion: duration + easing
- Elevation: shadows, glows, blur
- Radius: border radii

## Usage

Import the main entry point in your app:

```tsx
import "./styles/index.css";
```

Or import specific modules as needed:

```tsx
import "./styles/components/buttons.css";
```

## Principles

1. Tokens = pure values (no selectors)
2. Components consume tokens explicitly
3. Utilities are stateless helpers
4. Game styles live in their own namespace
