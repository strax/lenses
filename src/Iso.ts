import { Generic, Repr, Of } from "tshkt";
import { At } from "./At";
import { Lens } from "./Lens";

export class Iso<A, B> {
  [Generic.repr]: Generic<IsoRepr, [A, B]>

  constructor(private _from: (a: A) => B, private _into: (b: B) => A) {}

  from(a: A): B {
    return this._from(a)
  }

  into(b: B): A {
    return this._into(b)
  }

  inverse(): Iso<B, A> {
    return new Iso(this._into, this._from)
  }

  composeLens<S>(source: Lens<S, A>): Lens<S, B> {
    return new Lens(
      s => this.from(source.get(s)),
      s => b => source.set(s, this.into(b))
    )
  }

  composeAt<K extends string>(source: At<K>): Lens<Record<K, A>, B> {
    return new Lens(
      s => this.from(source.get(s)),
      s => b => source.set(s, this.into(b))
    )
  }

  composeIso<AA>(source: Iso<AA, A>): Iso<AA, B> {
    return new Iso(
      aa => this.from(source.from(aa)),
      b => source.into(this.into(b))
    )
  }

  compose<F, C>(other: ComposeIso<F, A, B, C>): Of<F, [A, C]> {
    return other.composeIso(this)
  }
}

interface ComposeIso<F, A, B, C> {
  composeIso(source: Iso<A, B>): Of<F, [A, C]>
}

interface IsoRepr extends Repr {
  type: this["argument"] extends [infer A, infer B] ? Iso<A, B> : never
}