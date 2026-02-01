import type { Validation } from "./validators.js";
import { unwrap } from "./unwrap.js";

type Validator<T> = (raw: unknown) => Validation<T>;

type ValidatorMap<T extends Record<string, any>> = {
  [K in keyof T]: Validator<T[K]>;
};

/**
 * Validate an object (typically req.body) using a validator map.
 *
 * Example:
 *   const data = validateBody(body, {
 *     email: vEmail,
 *     username: vUsername,
 *     password: vPassword,
 *   });
 */
export function validateBody<T extends Record<string, any>>(
  body: unknown,
  validators: ValidatorMap<T>
): T {
  const src = (body ?? {}) as Record<string, unknown>;
  const out = {} as T;

  for (const key in validators) {
    const validate = validators[key];
    out[key] = unwrap(validate(src[key]));
  }

  return out;
}
