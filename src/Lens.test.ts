import { Lens } from "."
import { Assert, Eq } from "./TestUtils"
import { at } from "./At"

// #region Composing Lens with Lens

namespace Test$CompositionWithLens {
  declare const fst: Lens<[number, [boolean, string]], [boolean, string]>
  declare const snd: Lens<[boolean, string], string>
  const res = fst.compose(snd)
  type _ = Assert<Eq<typeof res, Lens<[number, [boolean, string]], string>>>
}

// #endregion

// #region Composing At with Lens

namespace Test$CompositionWithAt {
  declare const fst: Lens<[number, string], number>
  const res = at("foo").compose(fst)
  type _ = Assert<Eq<typeof res, Lens<{ foo: [number, string] }, number>>>
}

// #endregion
