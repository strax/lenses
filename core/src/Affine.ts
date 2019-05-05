import { TypeFunction2 } from "./TypeFunctions"
import { Generic, Of } from "tshkt"
import { Option } from "./Option"
import { ComposeAffine } from "./ComposeAffine"

interface AtAffine$λ extends TypeFunction2 {
  type: Affine<this["arguments"][0], this["arguments"][1]>
}

export class Affine<S, A> {
  [Generic.repr]: Generic<AtAffine$λ, [S, A]>

  constructor(private _preview: (s: S) => Option<A>, private _set: (s: S) => (a: A) => S) {}

  preview(s: S): Option<A> {
    return this._preview(s)
  }

  set(s: S, a: A): S {
    return this._set(s)(a)
  }

  over(s: S, f: (a: A) => A): S {
    return this.preview(s).fold(() => s, a => this.set(s, f(a)))
  }

  compose<F, B>(optic: ComposeAffine<F, A, B>): Of<F, [S, B]> {
    return optic.composeAffine(this)
  }

  composeAffine<T>(parent: Affine<T, S>): Affine<T, A> {
    return new Affine(
      t => parent.preview(t).flatMap(s => this.preview(s)),
      t => a => parent.over(t, (s: S) => this.set(s, a))
    )
  }
}
