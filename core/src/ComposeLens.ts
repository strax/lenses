import { Lens } from "./Lens"
import { Of } from "tshkt"

/**
 * @internal
 */
export interface ComposeLens<F, A, B> {
  composeLens<S>(source: Lens<S, A>): Of<F, [S, B]>
}
