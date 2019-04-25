import { Iso, at, Lens } from ".";

import { Assert, Eq } from "./TestUtils";

// #region Composing At with Iso

namespace Test$ComposingAtWithIso {
  declare const iso: Iso<number, string>
  const res = at("foo").compose(iso)
  type _ = Assert<Eq<typeof res, Lens<{ foo: number }, string>>>
}

// #endregion

// #region Composing Lens with Iso

namespace Test$ComposingLensWithIso {
  declare const fst: Lens<[number, string], string>
  declare const iso: Iso<string, number>

  const res = fst.compose(iso)
  type _ = Assert<Eq<typeof res, Lens<[number, string], number>>>
}

// #endregion