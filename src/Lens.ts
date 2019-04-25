import { Generic, Of, Repr } from "tshkt";
import { Iso } from "./Iso";
import { TypeFunction2 } from "./TypeFunctions";
import { At } from "./At";
import { ComposeAt } from "./ComposeAt";
import { ComposeLens } from "./ComposeLens";

interface AtLens$λ<S> extends TypeFunction2 {
  type: Lens<Of<this["arguments"][0], S>, this["arguments"][1]>
}

export class Lens<S, A> {
  [Generic.repr]: Generic<Lens$λ, [S, A]>

  constructor(private _get: (s: S) => A, private _set: (s: S) => (a: A) => S) {}

  get(s: S): A {
    return this._get(s)
  }

  set(s: S, a: A): S {
    return this._set(s)(a)
  }

  compose<F, B>(other: ComposeLens<F, A, B>): Of<F, [S, B]> {
    return other.composeLens(this)
  }

  /**
   * @internal
   */
  composeIso<SS>(source: Iso<SS, S>): Lens<SS, A> {
    return new Lens(
      ss => this.get(source.from(ss)),
      ss => a => source.into(this.set(source.from(ss), a))
    )
  }

  /**
   * @internal
   */
  composeLens<SS>(source: Lens<SS, S>): Lens<SS, A> {
    return new Lens(
      ss => this.get(source.get(ss)),
      ss => a => source.set(ss, this.set(source.get(ss), a))
    )
  }

  [ComposeAt.Result]: AtLens$λ<S>
  composeAt<F>(source: At<F>): Lens<Of<F, S>, A> {
    throw "oh no"
  }
}



export interface Lens$λ extends TypeFunction2 {
  type: Lens<this["arguments"][0], this["arguments"][1]>
}