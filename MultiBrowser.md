## Browser Compatibility

This project targets modern, standards-compliant browsers.

### Target Browsers
- Google Chrome (latest)
- Mozilla Firefox (latest)
- Chromium-based browsers (Edge, Brave, etc.)

### Notes

- The app uses standard Web APIs only (Fetch, WebSocket, DOM, History API).
- Reactor routing avoids full page reloads and uses `history.pushState`.
- Production runs behind HTTPS via nginx; local dev is HTTP.

### Practical Validation

- Tested in Chrome and Firefox.
- Other Chromium-based browsers should behave consistently, but are not part of the formal test matrix.
