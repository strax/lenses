import { Lens } from "./Lens"
import { Of } from "tshkt"

export interface ComposeLens<F, A, B> {
  composeLens<S>(source: Lens<S, A>): Of<F, [S, B]>
}
