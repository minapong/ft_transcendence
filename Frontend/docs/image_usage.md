# Image Usage

## Bundled Assets (recommended)

Place images in `Frontend/src/assets` and import them in code so Vite can hash and optimize them.

```tsx
import logoUrl from "@/assets/logo.png";

<img src={logoUrl} alt="Logo" />
```

You can also use `new URL`:

```tsx
const heroUrl = new URL("../assets/hero.webp", import.meta.url).href;
```

## Public Assets (optional)

If you need a file to be served as-is (no hashing), create a `Frontend/public` folder and reference it by absolute path:

```html
<img src="/brand/hero.webp" alt="Hero" />
```

Files in `public` are copied directly to the build output without hashing.
