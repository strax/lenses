import { at, At } from "./At";
import { Iso } from "./Iso";
import { Lens } from "./Lens";
import { ToObj, Composition } from "./TypeFunctions";

type Assert<T extends true> = void
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

type x = Eq<unknown, string>

// #region Composing At with At

namespace Test$ComposingAtWithAt {
  const res = at("foo").compose(at("bar")).reify()
  type test = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}

// #endregion

// #region Composing At with Iso

namespace Test$ComposingAtWithIso {
  declare const iso: Iso<number, string>
  const res = at("foo").compose(iso)
  type test = Assert<Eq<typeof res, Lens<{ foo: number }, string>>>
}

// #endregion

// #region Composing At with Lens

namespace Test$ComposingAtWithLens {
  declare const fst: Lens<[number, string], number>
  const res = at("foo").compose(fst)
  type test = Assert<Eq<typeof res, Lens<{ foo: [number, string] }, number>>>
}

// #endregion

// #region Composing Lens with Lens

namespace Test$ComposingLensWithLens {
  declare const fst: Lens<[number, [boolean, string]], [boolean, string]>
  declare const snd: Lens<[boolean, string], string>
  const res = fst.compose(snd)
  type test = Assert<Eq<typeof res, Lens<[number, [boolean, string]], string>>>
}

// #endregion

// #region Composing Lens with At

namespace Test$ComposingLensWithAt {
  declare const fst: Lens<[number, { foo: string }], { foo: string }>
  const res = fst.compose(at("foo"))
  type test = Assert<Eq<typeof res, Lens<[number, { foo: string }], string>>>
}

// #region

// #region Composing Lens with Iso

namespace Test$ComposingLensWithIso {
  declare const fst: Lens<[number, string], string>
  declare const iso: Iso<string, number>

  const res = fst.compose(iso)
  type test = Assert<Eq<typeof res, Lens<[number, string], number>>>
}

// #endregino