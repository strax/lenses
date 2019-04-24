import { Repr, Of, Generic } from "tshkt";

namespace Witnessing {
  export declare const witness: unique symbol
}

export interface Witnessing<T> {
  [Witnessing.witness]: T
}

export interface TypeFunction1 extends Repr {
}

export interface TypeFunction2 extends Repr {
  arguments: this["argument"] extends [infer A, infer B] ? [A, B] : never
}

/**
 * Maps the given argument to a value indexed by key K.
 * This should be read as
 * ```typescript
 * <K extends string>(key: K) => <A>(value: A) => { [_ in K]: A }
 * ```
 */
export interface ToObj<K extends string> extends Repr, Witnessing<K> {
  type: { [_ in K]: this["argument"] }
}

/**
 * Encodes a composite function (f ∘ g)
 */
export interface Composition<F, G> extends Repr, Witnessing<[F, G]> {
  [Generic.repr]: Generic<Compose, [F, G]>
  type: Of<F, Of<G, this["argument"]>>
}

/**
 * Encodes the function composition operator in the form of `Composition`.
 */
export interface Compose extends TypeFunction2 {
  type: Composition<this["arguments"][0], this["arguments"][1]>
}

export interface Identity extends Repr {
  type: this["argument"]
}

export interface Const<A> extends TypeFunction1, Witnessing<A> {
  type: A
}