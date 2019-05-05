import { Generic, Of } from "tshkt"
import { At, at } from "./At"
import { Lens } from "./Lens"
import { TypeFunction2 } from "./TypeFunctions"
import { ComposeAt } from "./ComposeAt"
import { ComposeIso } from "./ComposeIso"
import { Fields, Strict } from "./utils"
import { Affine } from "./Affine"

interface AtIso$λ<A> extends TypeFunction2 {
  type: Lens<Of<this["arguments"][0], A>, this["arguments"][1]>
}

export class Iso<T, B> {
  [ComposeAt.Result]: AtIso$λ<T>;
  [Generic.repr]: Generic<Iso$λ, [T, B]>

  static id<A>(): Iso<A, A> {
    return ID_ISO as Iso<A, A>
  }

  constructor(private _from: (a: T) => B, private _into: (b: B) => T) {}

  view(a: T): B {
    return this._from(a)
  }

  review(b: B): T {
    return this._into(b)
  }

  inverse(): Iso<B, T> {
    return new Iso(this._into, this._from)
  }

  toLens(): Lens<T, B> {
    return new Lens(this._from, _ => this._into)
  }

  at<K extends Fields<B>>(key: K): Lens<T, B[K]> {
    return this.toLens().at(key)
  }

  peek<K extends Fields<B>>(key: K): Affine<T, Strict<B[K]>> {
    return this.toLens().peek(key)
  }

  /**
   * @internal
   */
  composeLens<S>(source: Lens<S, T>): Lens<S, B> {
    return new Lens(s => this.view(source.view(s)), s => b => source.set(s, this.review(b)))
  }

  /**
   * @internal
   */
  composeAt<S>(at: At<S>): Lens<Of<S, T>, B> {
    return new Lens(s => this.view(at.get(s)), s => b => at.set(s, this.review(b)))
  }

  /**
   * @internal
   */
  composeIso<AA>(source: Iso<AA, T>): Iso<AA, B> {
    return new Iso(aa => this.view(source.view(aa)), b => source.review(this.review(b)))
  }

  compose<F, C>(other: ComposeIso<F, T, B, C>): Of<F, [T, C]> {
    return other.composeIso(this)
  }
}

const ID_ISO: Iso<unknown, unknown> = new Iso(x => x, x => x)

interface Iso$λ extends TypeFunction2 {
  type: Iso<this["arguments"][0], this["arguments"][1]>
}
