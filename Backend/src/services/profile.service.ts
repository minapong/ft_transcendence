import { UserRepo } from "../repositories/user.repo.js";

import { unwrap } from "../lib/input/unwrap.js";
import { vAge, vLocation } from "../lib/input/validators.js";
import { WAREHOUSES } from "../lib/input/locations.js";

export const ProfileService = {
 async updateBasics(userId: number, ageRaw: unknown, locationRaw: unknown) {
    if (!Number.isFinite(userId)) throw new Error("UNAUTHORIZED");


    const age = unwrap(vAge(ageRaw)); // number | null
    const location = unwrap(vLocation(locationRaw, WAREHOUSES)); // string | null

    return await UserRepo.updateBasics(userId, { age, location });
  },
};