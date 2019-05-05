import util from "util"

export function eq(x: unknown, y: unknown): boolean {
  return util.isDeepStrictEqual(x, y)
}
