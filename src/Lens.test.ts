import { Lens } from ".";
import { Assert, Eq } from "./TestUtils";
import { at } from "./At";

// #region Composing Lens with Lens

namespace Test$ComposingLensWithLens {
  declare const fst: Lens<[number, [boolean, string]], [boolean, string]>
  declare const snd: Lens<[boolean, string], string>
  const res = fst.compose(snd)
  type test = Assert<Eq<typeof res, Lens<[number, [boolean, string]], string>>>
}

// #endregion

// #region Composing At with Lens

namespace Test$ComposingAtWithLens {
  declare const fst: Lens<[number, string], number>
  const res = at("foo").compose(fst)
  type test = Assert<Eq<typeof res, Lens<{ foo: [number, string] }, number>>>
}

// #endregion