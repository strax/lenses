import { Arbitrary as Arb, property, check, constant } from "fast-check"
import { eq } from "./utils"
import { Law } from "./Law"

interface LensLike<S, A> {
  get(s: S): A
  set(s: S, a: A): S
}

export namespace LensLaws {
  export async function runLaws<S, A>(optic: LensLike<S, A>, arbS: Arb<S>, arbA: Arb<A>) {
    await getPut(optic, arbS, arbA).run()
    await putGet(optic, arbS).run()
    await putPut(optic, arbS, arbA).run()
  }

  // view l (set l v s) ≡ v
  export function getPut<S, A>(optic: LensLike<S, A>, arbS: Arb<S>, arbA: Arb<A>): Law<[S, A]> {
    return new Law("LensLaws.getPut", () => {
      return check(property(arbS, arbA, (s, a) => eq(optic.get(optic.set(s, a)), a)))
    })
  }

  // set l (view l s) s ≡ s
  export function putGet<S, A>(optic: LensLike<S, A>, arbS: Arb<S>): Law<[LensLike<S, A>, S]> {
    return new Law("LensLaws.putGet", () => {
      return check(property(constant(optic), arbS, (o, s) => eq(optic.set(s, optic.get(s)), s)))
    })
  }

  // set l v' (set l v s) ≡ set l v' s
  export function putPut<S, A>(optic: LensLike<S, A>, arbS: Arb<S>, arbA: Arb<A>): Law<[S, A, A]> {
    return new Law("LensLaws.putPut", () => {
      return check(property(arbS, arbA, arbA, (s, a1, a2) => eq(optic.set(optic.set(s, a1), a2), optic.set(s, a2))))
    })
  }
}
