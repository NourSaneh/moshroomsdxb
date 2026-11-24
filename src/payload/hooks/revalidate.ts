import { revalidatePath } from "next/cache";

/** After anything is saved in the dashboard, rebuild the home page so changes show within seconds. */
export function revalidateHome() {
  try {
    revalidatePath("/", "layout");
  } catch {
    // revalidatePath only works inside a Next.js request (not in CLI scripts like the seed) — safe to ignore there.
  }
}
