import { TypeFunction2 } from "./TypeFunctions";
import { At } from "./At";
import { Of } from "tshkt";

export namespace ComposeAt {
  export declare const Result: unique symbol
}

export interface ComposeAt<F extends TypeFunction2, T> {
  [ComposeAt.Result]: F
  composeAt<S>(source: At<S>): Of<F, [S, T]>
}