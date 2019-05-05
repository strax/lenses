import { Prism, Lens } from "@lenses/core"

namespace Test$CompositionWithLens {
  declare const fst: Prism<{ foo?: { bar: string } }, { bar: string }>
  declare const snd: Lens<{ bar: string }, string>

  // $ExpectType Affine<{ foo?: { bar: string; } | undefined; }, string>
  fst.compose(snd)
}
