Static images to be served should be placed inside the `Frontend/public` directory.

Usage example:
```html
<img src="./a.webp">
```

Vite will always resolve the path relative to the `public` directory, so there is no need to specify the full path explicitly.

### Key Notes:
- Files in the `public` directory are copied directly into the build output without hashing.
- Files in the `assets` folder go through Vite's build pipeline and are hashed for cache-busting.