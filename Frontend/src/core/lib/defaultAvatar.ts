
import cat1 from "@/assets/Cat_1.webp";
import cat2 from "@/assets/Cat_2.webp";
import cat3 from "@/assets/Cat_3.webp";
import cat4 from "@/assets/Cat_4.webp";
import cat5 from "@/assets/Cat_5.webp";

const CATS = [cat1, cat2, cat3, cat4, cat5];

/**
 * Returns a deterministic default avatar based on the user ID.
 * If no userId is provided, returns a random one (less stable).
 */
export function getDefaultAvatar(userId?: number | string): string {
    if (!userId) {
        // Fallback random
        return CATS[Math.floor(Math.random() * CATS.length)];
    }

    const id = Number(userId);
    if (isNaN(id)) {
        // Fallback for non-numeric IDs (e.g. string UIDs), hash simple sum
        const hash = String(userId).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return CATS[hash % CATS.length];
    }

    return CATS[id % CATS.length];
}
