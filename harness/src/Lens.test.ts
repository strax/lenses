import { Lens, at } from "@lenses/core"

declare const fst: Lens<["1", ["2", "3"]], ["2", "3"]>
declare const snd: Lens<["2", "3"], "3">

// #region Composing Lens to Lens
// $ExpectType Lens<["1", ["2", "3"]], "3">
fst.compose(snd)
// #endregion

// #region Composing At to Lens
// $ExpectType Lens<{ foo: ["2", "3"]; }, "3">
at("foo").compose(snd)
// #endregion
