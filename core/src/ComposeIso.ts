import { Iso } from "./Iso"
import { Of } from "tshkt"

export namespace ComposeIso {
  export const composeIso = Symbol("ComposeIso.composeIso")
}

export interface ComposeIso<F, A, B, C> {
  [ComposeIso.composeIso](source: Iso<A, B>): Of<F, [A, C]>
}
