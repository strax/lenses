import { Affine } from "./Affine"
import { Of } from "tshkt"

export namespace ComposeAffine {
  export const composeAffine = Symbol("ComposeAffine.composeAffine")
}

export interface ComposeAffine<F, A, B> {
  [ComposeAffine.composeAffine]<S>(source: Affine<S, A>): Of<F, [S, B]>
}
