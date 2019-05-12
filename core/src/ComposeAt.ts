import { Of } from "tshkt";
import { At } from "./At";
import { Compose, TypeFunction2, Identity, TypeFunction1 } from "./TypeFunctions";

export namespace ComposeAt {
  /**
   * Marker symbol for hinting the transform type in `ComposeAt`.
   */
  export declare const Transform: unique symbol
  export type Transform = typeof Transform
  export const composeAt = Symbol("ComposeAt.composeAt")
}

/**
 * Contract for composing optics with `At`s.
 * 
 * ---
 * #### Understanding the type parameters
 * 
 * The resulting type of `composeAt` can be read as `λ<T<S>, A>`.
 * This means that the output type of `composeAt` must be a two-arity type constructor (e.g. `TypeFunction2`).
 * The source type `S` is also a type constructor (of kind `TypeFunction1`) – different compositions need to perform
 * different operations on the `S` type parameter. For example, composing `At<S1>` with `At<S2>` results in `At$Composite<S1, S2>`
 * in which case `T = Identity`. However, composing `At<S1>` with `Lens<S2, A>` results in `Lens<Of<S1, S2>, A>` in which case
 * `T = Ap<S2>`.
 */
export interface ComposeAt<λ extends TypeFunction2, S, A, T extends TypeFunction1 = Identity> {
  // We need to hint the compiler about the transformer type variable
  [ComposeAt.Transform]: T
  // Hack: T & {} forces a lower priority inference site for `T` so the type in `[ComposeAt.Transform]` is always used first
  [ComposeAt.composeAt](source: At<S>): Of<λ, [Of<T & {}, S>, A]>
}