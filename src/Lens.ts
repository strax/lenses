import { Generic, Of, Repr } from "tshkt";
import { Iso } from "./Iso";

export class Lens<S, A> {
  [Generic.repr]: Generic<LensRepr, [S, A]>

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

  composeIso<SS>(source: Iso<SS, S>): Lens<SS, A> {
    return new Lens(
      ss => this.get(source.from(ss)),
      ss => a => source.into(this.set(source.from(ss), a))
    )
  }

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

interface LensRepr extends Repr {
  type: this["argument"] extends [infer A, infer B] ? Lens<A, B> : never
}