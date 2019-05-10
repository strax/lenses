import { Lens } from "./Lens"
import { Of } from "tshkt"

export namespace ComposeLens {
  export const composeLens = Symbol("ComposeLens.composeLens")
}

/**
 * @internal
 */
export interface ComposeLens<F, A, B> {
  [ComposeLens.composeLens]<S>(source: Lens<S, A>): Of<F, [S, B]>
}
