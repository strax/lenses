import { Iso, at, Lens } from "@lenses/core"

// #region Composing At with Iso
namespace Test$CompositionWithAt {
  declare const iso: Iso<number, string>

  // $ExpectType Lens<{ foo: number; }, string>
  at("foo").compose(iso)
}
// #endregion

// #region Composing Lens with Iso
namespace Test$CompositionWithLens {
  declare const fst: Lens<[number, string], string>
  declare const iso: Iso<string, number>

  // $ExpectType Lens<[number, string], number>
  fst.compose(iso)
}
// #endregion
