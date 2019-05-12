import { Repr, Of, Generic } from "tshkt"

namespace Witnessing {
  export declare const witness: unique symbol
}

export interface Witnessing<T> {
  [Witnessing.witness]: T
}

export interface TypeFunction1 extends Repr {}
export interface TypeFunction2 extends Repr {
  arguments: this["argument"] extends [infer A, infer B] ? [A, B] : never
}

export { TypeFunction1 as TFn1, TypeFunction2 as TFn2 }

/**
 * For a type level function f, returns the inverse function of f.
 */
export type Inverse<T> = T extends Compose<infer F, infer G> ? InverseC<F, G> : InverseF<T>
interface InverseC<F, G> extends TypeFunction1, Witnessing<[F, G]> {
  type: Of<Compose<Inverse<G>, Inverse<F>>, this["argument"]>
}
interface InverseF<F> extends TypeFunction1, Witnessing<F> {
  type: this["argument"] extends Of<F, infer A> ? A : never
}

/**
 * Encodes a composite function (f ∘ g)
 */
export interface Compose<F, G> extends Repr, Witnessing<[F, G]> {
  type: Of<F, Of<G, this["argument"]>>
}

export interface Identity extends Repr {
  type: this["argument"]
}

export interface Ap<A> extends Repr, Witnessing<A> {
  type: Of<this["argument"], A>
}

export interface Const<A> extends TypeFunction1, Witnessing<A> {
  type: A
}
