import { Generic, Of } from "tshkt"
import { Affine } from "./Affine"
import { ComposeIso } from "./ComposeIso"
import { ComposeLens } from "./ComposeLens"
import { ComposePrism } from "./ComposePrism"
import { Iso } from "./Iso"
import { Option } from "./Option"
import { Prism, strict } from "./Prism"
import { SetterLike } from "./SetterLike"
import { TypeFunction2, Const, TypeFunction1, Witnessing, Ap, Identity } from "./TypeFunctions"
import { Fields, Strict } from "./utils"
import { At } from "./At";
import { ComposeAt } from "./ComposeAt";

interface Lens$λ extends TypeFunction2 {
  type: Lens<this["arguments"][0], this["arguments"][1]>
}

export namespace Lens {
  export type Type = Lens$λ
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
    return other[ComposeLens.composeLens](this)
  }

  asAffine(): Affine<S, A> {
    return new Affine(s => Option.pure(this.view(s)), this._set)
  }

  // @contract ComposeAt<Lens<?, ?>, S, A>
  [ComposeAt.Transform]!: Ap<S>
  composeAt<F>(source: At<F>) {
    return source.toLens<S>().compose(this)
  }

  /**
   * @internal
   */
  [ComposePrism.composePrism]<T>(prism: Prism<T, S>): Affine<T, A> {
    return prism.asAffine().compose(this.asAffine())
  }

  /**
   * @internal
   */
  [ComposeIso.composeIso]<SS>(source: Iso<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.view(source.view(ss)), ss => a => source.review(this.set(source.view(ss), a)))
  }

  /**
   * @internal
   */
  [ComposeLens.composeLens]<SS>(source: Lens<SS, S>): Lens<SS, A> {
    return new Lens(ss => this.view(source.view(ss)), ss => a => source.set(ss, this.set(source.view(ss), a)))
  }
}


export function fst<A, B>(): Lens<[A, B], A> {
  return new Lens(([a, _]) => a, ([_, b]) => a => [a, b])
}
