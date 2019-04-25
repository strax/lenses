import { Of, Repr, Generic } from "tshkt";
import { Lens } from "./Lens";
import { ToObj, Composition, TypeFunction2 } from "./TypeFunctions";
import { ComposeAt } from "./ComposeAt";

// export type SynthesizeObject<P extends Path, V> = [] extends P ? V : {
//   [K in Head<P>]: SynthesizeObject<Tail<P>, V>
// }

interface At$λ extends Repr {
  type: At<this["argument"]>
}

export class At<S> {
  [ComposeAt.Result]: At$Composite$λ
  [Generic.repr]: Generic<At$λ, S>

  constructor() {}

  static at<K extends string>(key: K) {
    return new At<ToObj<K>>([key])
  }

  get<A>(source: Of<S, A>): A {
    throw new Error("unimplemented")
  }

  set<SA extends Of<S, A>, A>(source: SA, a: A): SA {
    return { ...source, a }
  }

  compose<F extends TypeFunction2, T>(other: ComposeAt<F, T>): Of<F, [S, T]> {
    return other.composeAt(this)
  }

  composeAt<G>(from: At<G>): At$Composite<G, S> {
    throw new Error("Not implemented")
  }

  toLens<A>(): Lens<Of<S, A>, A> {
    return new Lens<Of<S, A>, A>(this.get, s => a => this.set(s, a))
  }
}

interface At$Composite$λ extends TypeFunction2 {
  type: At$Composite<this["arguments"][0], this["arguments"][1]>
}
class At$Composite<T, U> {
  [Generic.repr]: Generic<At$Composite$λ, [T, U]>

  constructor(private first: At<T>, private second: At<U>) {
  }

  get<A>(source: Of<Composition<T, U>, A>): A {
    return this.second.get(this.first.get(source))
  }

  set<SA extends Of<Composition<T, U>, A>, A>(source: SA, a: A): SA {
    return this.first.set(source, this.second.set(this.first.get(source) as Of<U, A>, a))
  }

  compose<F extends TypeFunction2, R>(other: ComposeAt<F, R>): Of<F, [Composition<T, U>, R]> {
    return other.composeAt(this.reify())
  }

  reify() {
    type S = Composition<T, U>

    const composite = this
    const at = new class At$Composite$Reified extends At<S> {
      get<SA extends Of<S, A>, A>(source: SA): A {
        return composite.get(source) as A
      }

      // @ts-ignore 2416
      set<SA extends Of<S, A>, A>(source: SA, a: A): SA {
        return composite.set(source, a)
      }
    }
    return at as At<S>
  }
}



export function at<K extends string>(key: K): At<ToObj<K>> {
  return At.at(key)
}
