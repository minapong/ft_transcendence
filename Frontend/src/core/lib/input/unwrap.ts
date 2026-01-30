import type { Validation } from "./validators";

export function unwrap<T>(v: Validation<T>): T {
  if ("error" in v){
    throw new Error(v.error);
  }
  return v.value;
}

