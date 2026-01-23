# lib Folder

The `lib` folder contains shared utility functions used across the frontend application.

## Files

### api.ts
A wrapper around the native `fetch` API that:
- Automatically attaches the JWT authentication token (from localStorage) to requests via the `Authorization: Bearer` header
- Sets `Content-Type: application/json` when a request body is present
- Provides a consistent way to make authenticated API calls throughout the app

### auth.ts
A simple helper to retrieve the current user's authentication data:
- Reads the `auth` object from `localStorage`
- Parses and returns it (or `null` if not found/invalid)
- Used by `apiFetch` to get the token for authenticated requests

## Summary

The `lib` folder serves as a place for low-level, reusable utilities—specifically handling authentication state retrieval and making authenticated HTTP requests to the backend.
