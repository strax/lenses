import { Generic, Of, Repr } from "tshkt"
import { Iso } from "./Iso"
import { Lens, Lens$λ } from "./Lens"
import { Compose, Inverse, TypeFunction1, TypeFunction2, Witnessing, Identity, Const, Ap } from "./TypeFunctions"
import { ComposeAt } from "./ComposeAt";

const inspect = Symbol.for("nodejs.util.inspect.custom")

/**
 * Maps the given argument to a value indexed by key K.
 * This should be read as
 * ```typescript
 * <K extends string>(key: K) => <A>(value: A) => { [_ in K]: A }
 * ```
 */
interface Ix<K extends string> extends TypeFunction1, Witnessing<K> {
  type: { [_ in K]: this["argument"] }
}

interface At$AtIndex$λ extends Repr {
  type: At<this["argument"]>
}

export abstract class At<F> {
  toLens<A>(): Lens<Of<F, A>, A> {
    return new Lens(s => this.get(s) as A, s => a => this.set(s, a))
  }

  abstract get<S extends Of<F, unknown>>(source: S): Of<Inverse<F>, S>

  set<SA extends Of<F, A>, A>(source: SA, a: A): SA {
    return this._set(source, a)
  }

  protected abstract _set<SA extends Of<F, unknown>>(source: SA, a: unknown): SA

  compose<λ extends TypeFunction2, A, T>(other: ComposeAt<λ, F, A, T>): Of<λ, [Of<T, F>, A]> {
    return other.composeAt(this)
  }

  [ComposeAt.Transform]!: Identity
  composeAt<S>(source: At<S>): At$Composite<S, F> {
    return new At$Composite(source, this)
  }
}

export namespace At {
  export function at<K extends string>(key: K) {
    return new At$AtIndex(key)
  }
}

class At$AtIndex<K extends string> extends At<Ix<K>> {
  [Generic.repr]: Generic<At$AtIndex$λ, Ix<K>>

  constructor(private readonly key: K) {
    super()
  }

  get<S>(source: S): Of<Inverse<Ix<K>>, S> {
    if (this.key in source) {
      return (source as any)[this.key]
    } else {
      throw new Error(`input does not contain field "${this.key}"`)
    }
  }

  at<L extends string>(other: L): At$Composite<Ix<K>, Ix<L>> {
    throw new Error("not implemented")
  }

  protected _set<A, SA extends Of<Ix<K>, A>>(source: SA, a: A): SA {
    return { ...source, [this.key]: a }
  }

  toString() {
    return `At("${this.key}")`
  }

  [inspect]() {
    return this.toString()
  }
}

interface At$Composite$λ extends TypeFunction2 {
  type: At$Composite<this["arguments"][0], this["arguments"][1]>
}
class At$Composite<T, U> extends At<Compose<T, U>> {
  [Generic.repr]: Generic<At$Composite$λ, [T, U]>

  constructor(private first: At<T>, private second: At<U>) {
    super()
  }

  get<S extends Of<Inverse<Compose<T, U>>, unknown>>(source: S): Of<Compose<Inverse<U>, Inverse<T>>, S> {
    // TODO: Check if these `any` casts can be removed
    return this.second.get(this.first.get(source as any) as any)
  }

  protected _set<SA extends Of<Compose<T, U>, A>, A>(source: SA, a: A): SA {
    return this.first.set(source, this.second.set(this.first.get(source as any) as Of<U, A>, a)) as SA
  }

  reify(): At<Compose<T, U>> {
    return this as At<Compose<T, U>>
  }

  [inspect]() {
    return `${this.first}.compose(${this.second})`
  }
}

export function at<K extends string>(key: K): At<Ix<K>>
export function at<T>(): Iso<T, T>
export function at<K extends string>(key?: K) {
  if (key) {
    return At.at(key) as At<Ix<K>>
  } else {
    return Iso.id()
  }
}
