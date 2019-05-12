import { Of } from "tshkt";
import { At } from "./At";
import { Compose, TypeFunction2, Identity, TypeFunction1 } from "./TypeFunctions";

export namespace ComposeAt {
  export declare const Transform: unique symbol
  export type Transform = typeof Transform
}

export interface ComposeAt<λ extends TypeFunction2, S, A, T extends TypeFunction1 = Identity> {
  // We need to hint the compiler about the transformer type variable
  [ComposeAt.Transform]: T
  // Hack: T & {} forces a lower priority inference site for `T`
  composeAt(source: At<S>): Of<λ, [Of<T & {}, S>, A]>
}