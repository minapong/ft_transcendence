import type { Validation } from "./validators.js";

export function unwrap<T>(v: Validation<T>): T {
  if (!v.ok) {
    throw new Error(v.error);
  }
  return v.value;
}

