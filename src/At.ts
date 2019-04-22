import { Of } from "tshkt";

export class At<K extends string> {
  constructor(private key: K) {}

  static at<K extends string>(key: K) {
    return new At(key)
  }

  get<A>(source: { [_ in K]: A }): A {
    return source[this.key]
  }

  set<S extends { [_ in K]: A }, A>(source: S, a: A): S {
    return { ...source, a }
  }

  compose<F, A, B>(other: ComposeAt<F, K, A, B>): Of<F, [Record<K, A>, B]> {
    return other.composeAt(this)
  }
}

interface ComposeAt<F, K extends string, A, B> {
  composeAt(source: At<K>): Of<F, [Record<K, A>, B]>
}