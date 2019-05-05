import { Lens, at } from "@lenses/core"

// #region Composing Lens with Lens
namespace Test$CompositionWithLens {
  declare const fst: Lens<[number, [boolean, string]], [boolean, string]>
  declare const snd: Lens<[boolean, string], string>
  // $ExpectType Lens<[number, [boolean, string]], string>
  fst.compose(snd)
}
// #endregion

// #region Composing At with Lens
namespace Test$CompositionWithAt {
  declare const fst: Lens<[number, string], number>
  // $ExpectType Lens<{ foo: [number, string]; }, number>
  at("foo").compose(fst)
}
// #endregion
