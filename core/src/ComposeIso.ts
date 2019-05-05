import { Iso } from "./Iso"
import { Of } from "tshkt"

/**
 * @internal
 */
export interface ComposeIso<F, A, B, C> {
  composeIso(source: Iso<A, B>): Of<F, [A, C]>
}
