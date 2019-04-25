import { at, At } from "./At";
import { Iso } from "./Iso";
import { Lens } from "./Lens";
import { ToObj, Composition } from "./TypeFunctions";

type Assert<T extends true> = void
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

type x = Eq<unknown, string>

// #region Composing At with At

namespace Test$1 {
  const res = at("foo").compose(at("bar")).reify()
  type test = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}

// #endregion

// #region Composing At with Iso

namespace Test$2 {
  declare const iso: Iso<number, string>
  const res = at("foo").compose(iso)
  type test = Assert<Eq<typeof res, Lens<{ foo: number }, string>>>
}

// #endregion

// #region Composing At with Lens

namespace Test$3 {
  declare const fst: Lens<[number, string], number>
  const res = at("foo").compose(fst)
  type test = Assert<Eq<typeof res, Lens<{ foo: [number, string] }, number>>>
}

// #endregion