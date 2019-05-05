import { Prism } from "./Prism"
import { Of } from "tshkt"

export interface ComposePrism<F, A, B> {
  composePrism<S>(prism: Prism<S, A>): Of<F, [S, B]>
}
