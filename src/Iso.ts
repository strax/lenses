import { Generic, Repr, Of } from "tshkt";
import { At, ComposeAt } from "./At";
import { Lens, Lens$λ } from "./Lens";
import { TypeFunction2 } from "./TypeFunctions";

interface AtIso$λ<A> extends TypeFunction2 {
  type: Lens<Of<this["arguments"][0], A>, this["arguments"][1]>
}

export class Iso<A, B> implements ComposeAt<AtIso$λ<A>, B> {
  [ComposeAt.TypeFamily]: AtIso$λ<A>
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

  /**
   * @internal
   */
  composeLens<S>(source: Lens<S, A>): Lens<S, B> {
    return new Lens(
      s => this.from(source.get(s)),
      s => b => source.set(s, this.into(b))
    )
  }

  composeAt<S>(at: At<S>): Lens<Of<S, A>, B> {
    return new Lens(
      s => this.from(at.get(s)),
      s => b => at.set(s, this.into(b))
    )
  }

  /**
   * @internal
   */
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