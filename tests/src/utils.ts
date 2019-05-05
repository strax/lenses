import { isDeepStrictEqual } from "util"

export function eq(a: unknown, b: unknown): boolean {
  return isDeepStrictEqual(a, b)
}
