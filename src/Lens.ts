import { Generic, Of, Repr } from "tshkt";
import { Iso } from "./Iso";
import { TypeFunction2 } from "./TypeFunctions";

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
}

interface ComposeLens<F, A, B> {
  composeLens<S>(source: Lens<S, A>): Of<F, [S, B]>
}

export interface Lens$λ extends TypeFunction2 {
  type: Lens<this["arguments"][0], this["arguments"][1]>
}