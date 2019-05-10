import { TypeFunction2 } from "./TypeFunctions"
import { Generic, Of } from "tshkt"
import { Iso } from "./Iso"
import { Lens } from "./Lens"
import { Affine } from "./Affine"
import { Review } from "./Review"
import { ComposePrism } from "./ComposePrism"
import { Option } from "./Option"
import { Strict } from "./utils"
import { ComposeLens } from "./ComposeLens";
import { ComposeIso } from "./ComposeIso";

interface Prism$λ extends TypeFunction2 {
  type: Prism<this["arguments"][0], this["arguments"][1]>
}

export class Prism<S, A> {
  [Generic.repr]: Generic<Prism$λ, [S, A]>

  constructor(private _preview: (s: S) => Option<A>, private _review: (a: A) => S) {}

  review(a: A): S {
    return this._review(a)
  }

  preview(s: S): Option<A> {
    return this._preview(s)
  }

  asAffine(): Affine<S, A> {
    return new Affine(this.preview, _ => a => this.review(a))
  }

  compose<F, B>(optic: ComposePrism<F, A, B>): Of<F, [S, B]> {
    return optic[ComposePrism.composePrism](this)
  }

  [ComposeIso.composeIso]<T>(iso: Iso<T, S>): Prism<T, A> {
    return new Prism(t => this.preview(iso.view(t)), a => iso.review(this.review(a)))
  }

  [ComposeLens.composeLens]<T>(lens: Lens<T, S>): Affine<T, A> {
    return new Affine(t => this.preview(lens.view(t)), t => a => lens.set(t, this.review(a)))
  }

  [ComposePrism.composePrism]<T>(prism: Prism<T, S>): Prism<T, A> {
    return new Prism(t => prism.preview(t).flatMap(s => this.preview(s)), a => prism.review(this.review(a)))
  }
}

/**
 * A {@link Prism} that matches non-undefined values.
 */
export function strict<A>(): Prism<A, Strict<A>> {
  return new Prism(a => Option.option(a), x => x)
}
