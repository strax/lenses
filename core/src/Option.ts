export abstract class Option<A> {
  protected constructor() {}

  abstract fold<B>(whenNone: () => B, whenSome: (a: A) => B): B

  isSome(): this is Some<A> {
    return this.fold(() => false, () => true)
  }

  isNone(): this is None {
    return !this.isSome()
  }

  map<B>(f: (a: A) => B): Option<B> {
    return this.flatMap(a => Option.pure(f(a)))
  }

  flatMap<B>(f: (a: A) => Option<B>): Option<B> {
    return this.fold(() => Option.none(), f)
  }
}

class Some<A> extends Option<A> {
  constructor(private value: A) {
    super()
  }

  fold<B>(whenNone: () => B, whenSome: (a: A) => B): B {
    return whenSome(this.value)
  }
}

class None extends Option<never> {
  static instance = new None()

  protected constructor() {
    super()
  }

  fold<B>(whenNone: () => B, whenSome: (a: never) => B): B {
    return whenNone()
  }
}

export namespace Option {
  export function pure<A>(a: A): Option<A> {
    return new Some(a)
  }

  export function none<A>(): Option<A> {
    return None.instance
  }

  type NonUndefined<A> = A extends undefined ? never : A

  export function option<A>(a: A): Option<NonUndefined<A>> {
    if (a !== undefined) {
      return pure(a as NonUndefined<A>)
    } else {
      return none()
    }
  }
}
