import { Generic, Of, Repr } from "tshkt"
import { Iso } from "./Iso"
import { TypeFunction2 } from "./TypeFunctions"
import { At, at } from "./At"
import { ComposeAt } from "./ComposeAt"
import { ComposeLens } from "./ComposeLens"
import { SetterLike } from "./SetterLike"
import { Affine } from "./Affine"
import { strict, Prism } from "./Prism"
import { Fields, Strict } from "./utils"
import { Option } from "./Option"

interface AtLens$λ<S> extends TypeFunction2 {
  type: Lens<Of<this["arguments"][0], S>, this["arguments"][1]>
}

export class Lens<S, A> implements SetterLike<S, A> {
  static id<S>(): Lens<S, S> {
    return Iso.id<S>().toLens()
  }

  [Generic.repr]: Generic<Lens$λ, [S, A]>

  constructor(private _get: (s: S) => A, private _set: (s: S) => (a: A) => S) {}

  view(s: S): A {
    return this._get(s)
  }

  set(s: S, a: A): S {
    return this._set(s)(a)
  }

  update(s: S, f: (a: A) => A): S {
    return this._set(s)(f(this._get(s)))
  }

  at<K extends Fields<A>>(key: K): Lens<S, A[K]> {
    return new Lens(s => this.view(s)[key], s => b => ({ ...s, [key]: b }))
  }

  peek<K extends Fields<A>>(key: K): Affine<S, Strict<A[K]>> {
    return this.at(key).compose(strict())
  }

  compose<F, B>(other: ComposeLens<F, A, B>): Of<F, [S, B]> {
    return other.composeLens(this)
  }

  asAffine(): Affine<S, A> {
    return new Affine(s => Option.pure(this.view(s)), this._set)
  }

  /**
   * @internal
   */
  composePrism<T>(prism: Prism<T, S>): Affine<T, A> {
    return prism.asAffine().compose(this.asAffine())
  }

  /**
   * @internal
   */
  composeIso<SS>(source: Iso<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.view(source.view(ss)), ss => a => source.review(this.set(source.view(ss), a)))
  }

  /**
   * @internal
   */
  composeLens<SS>(source: Lens<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.view(source.view(ss)), ss => a => source.set(ss, this.set(source.view(ss), a)))
  }

  [ComposeAt.Result]: AtLens$λ<S>

  /**
   * @internal
   */
  composeAt<F>(source: At<F>): Lens<Of<F, S>, A> {
    return source.toLens<S>().compose(this)
  }
}

export interface Lens$λ extends TypeFunction2 {
  type: Lens<this["arguments"][0], this["arguments"][1]>
}

export function fst<A, B>(): Lens<[A, B], A> {
  return new Lens(([a, _]) => a, ([_, b]) => a => [a, b])
}
