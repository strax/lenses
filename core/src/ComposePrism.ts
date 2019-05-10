import { Prism } from "./Prism"
import { Of } from "tshkt"

export namespace ComposePrism {
  export const composePrism = Symbol("ComposePrism.composePrism")
}

export interface ComposePrism<F, A, B> {
  [ComposePrism.composePrism]<S>(prism: Prism<S, A>): Of<F, [S, B]>
}
