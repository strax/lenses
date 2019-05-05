import { Of, Repr, Generic } from "tshkt"
import { Lens } from "./Lens"
import { ToObj, Composition, TypeFunction2 } from "./TypeFunctions"
import { ComposeAt } from "./ComposeAt"
import { Iso } from "./Iso"

interface At$λ extends Repr {
  type: At<this["argument"]>
}

export abstract class At<F> {
  [ComposeAt.Result]: At$Composite$λ

  at<K extends string>(key: K): At$Composite<F, ToObj<K>> {
    return this.compose(At.at(key))
  }

  toLens<A>(): Lens<Of<F, A>, A> {
    return new Lens(this.get, s => a => this.set(s, a))
  }

  abstract get<A>(source: Of<F, A>): A

  set<SA extends Of<F, A>, A>(source: SA, a: A): SA {
    return this._set(source, a)
  }

  protected abstract _set<SA extends Of<F, unknown>>(source: SA, a: unknown): SA

  compose<G extends TypeFunction2, T>(other: ComposeAt<G, T>): Of<G, [F, T]> {
    return other.composeAt(this)
  }

  composeAt<G>(from: At<G>): At$Composite<G, F> {
    return new At$Composite(from, this)
  }
}

export namespace At {
  export function at<K extends string>(key: K) {
    return new At$AtIndex(key)
  }
}

class At$AtIndex<K extends string> extends At<ToObj<K>> {
  [Generic.repr]: Generic<At$λ, ToObj<K>>;
  [ComposeAt.Result]: At$Composite$λ

  constructor(private readonly key: K) {
    super()
  }

  get<A>(source: Of<ToObj<K>, A>): A {
    return source[this.key]
  }

  protected _set<A, SA extends Of<ToObj<K>, A>>(source: SA, a: A): SA {
    return { ...source, [this.key]: a }
  }

  toString() {
    return `At("${this.key}")`
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toString()
  }
}

interface At$Composite$λ extends TypeFunction2 {
  type: At$Composite<this["arguments"][0], this["arguments"][1]>
}
class At$Composite<T, U> extends At<Composition<T, U>> {
  [ComposeAt.Result]: At$Composite$λ;
  [Generic.repr]: Generic<At$Composite$λ, [T, U]>

  constructor(private first: At<T>, private second: At<U>) {
    super()
  }

  get<A>(source: Of<Composition<T, U>, A>): A {
    return this.second.get(this.first.get(source))
  }

  protected _set<SA extends Of<Composition<T, U>, A>, A>(source: SA, a: A): SA {
    return this.first.set(source, this.second.set(this.first.get(source) as Of<U, A>, a)) as SA
  }

  reify(): At<Composition<T, U>> {
    return this as At<Composition<T, U>>
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return `${this.first}.compose(${this.second})`
  }
}

export function at<K extends string>(key: K): At$AtIndex<K>
export function at<T>(): Iso<T, T>
export function at<K extends string>(key?: K) {
  if (key) {
    return At.at(key)
  } else {
    return Iso.id()
  }
}
