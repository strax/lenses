import { Generic, Of, Repr } from "tshkt"
import { Iso } from "./Iso"
import { TypeFunction2 } from "./TypeFunctions"
import { At } from "./At"
import { ComposeAt } from "./ComposeAt"
import { ComposeLens } from "./ComposeLens"
import { SetterLike } from "./SetterLike"

interface AtLens$λ<S> extends TypeFunction2 {
  type: Lens<Of<this["arguments"][0], S>, this["arguments"][1]>
}

type Fields<T> = keyof T extends infer K ? (K extends keyof T ? (T[K] extends Function ? never : K) : never) : never

export class Lens<S, A> implements SetterLike<S, A> {
  static id<S>(): Lens<S, S> {
    // Reused to avoid allocating unneeded objects
    return ID_LENS
  }

  [Generic.repr]: Generic<Lens$λ, [S, A]>

  constructor(private _get: (s: S) => A, private _set: (s: S) => (a: A) => S) {}

  get(s: S): A {
    return this._get(s)
  }

  set(s: S, a: A): S {
    return this._set(s)(a)
  }

  update(s: S, f: (a: A) => A): S {
    return this._set(s)(f(this._get(s)))
  }

  at<K extends Fields<A>>(key: K): Lens<S, A[K]> {
    return new Lens(s => this.get(s)[key], s => b => ({ ...s, [key]: b }))
  }

  compose<F, B>(other: ComposeLens<F, A, B>): Of<F, [S, B]> {
    return other.composeLens(this)
  }

  /**
   * @internal
   */
  composeIso<SS>(source: Iso<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.get(source.from(ss)), ss => a => source.into(this.set(source.from(ss), a)))
  }

  /**
   * @internal
   */
  composeLens<SS>(source: Lens<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.get(source.get(ss)), ss => a => source.set(ss, this.set(source.get(ss), a)))
  }

  [ComposeAt.Result]: AtLens$λ<S>

  /**
   * @internal
   */
  composeAt<F>(source: At<F>): Lens<Of<F, S>, A> {
    return source.toLens<S>().compose(this)
  }
}

const ID_LENS: Lens<any, any> = new Lens(s => s, s => a => s)

export interface Lens$λ extends TypeFunction2 {
  type: Lens<this["arguments"][0], this["arguments"][1]>
}
