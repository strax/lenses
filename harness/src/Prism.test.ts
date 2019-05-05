import { Prism, Lens, Affine } from "@lenses/core"
import { Assert, Eq } from "./TestUtils"

namespace Test$CompositionWithLens {
  declare const fst: Prism<{ foo?: { bar: string } }, { bar: string }>
  declare const snd: Lens<{ bar: string }, string>
  const res = fst.compose(snd)
  type _ = Assert<Eq<typeof res, Affine<{ foo?: { bar: string } }, string>>>
}
