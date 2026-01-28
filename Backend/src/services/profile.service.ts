import { UserRepo } from "../repositories/user.repo.js";


export const ProfileService = {
  async updateBasics(userId: number, age: number | null, location: string | null) {
    if (!Number.isFinite(userId)) throw new Error("UNAUTHORIZED");

    // validate age
    if (age != null) {
      if (!Number.isFinite(age) || age < 0 || age > 130) throw new Error("AGE_INVALID");
    }

    // validate location
    if (location != null) {
      const loc = String(location).trim();
      if (loc.length === 0) location = null;
      if (loc.length > 64) throw new Error("LOCATION_TOO_LONG");
    }

    return await UserRepo.updateBasics(userId, { age, location });
  },
};
