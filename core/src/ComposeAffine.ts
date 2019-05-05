import { Affine } from "./Affine"
import { Of } from "tshkt"

/**
 * @internal
 */
export interface ComposeAffine<F, A, B> {
  composeAffine<S>(source: Affine<S, A>): Of<F, [S, B]>
}
