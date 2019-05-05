import { Iso, at, Lens } from "@lenses/core"

// #region Composing At with Iso
declare const iso: Iso<number, string>
// $ExpectType Lens<{ foo: number; }, string>
at("foo").compose(iso)
// #endregion

// #region Composing Lens with Iso
declare const fst: Lens<[number, string], number>
// $ExpectType Lens<[number, string], string>
fst.compose(iso)
// #endregion
