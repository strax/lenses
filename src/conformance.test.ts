import { at, At } from "./At";
import { Iso } from "./Iso";
import { Lens } from "./Lens";
import { ToObj, Composition } from "./TypeFunctions";

type Assert<T extends true> = T
type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false

// #region Test: Composing At with At

const res0 = at("foo").compose(at("bar")).reify()
type test0 = Assert<Eq<typeof res0, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>

// #endregion

// #region Test: Composing At with Iso

declare const iso: Iso<number, string>
const res1 = at("foo").compose(iso)
type test1 = Assert<Eq<typeof res1, Lens<{ foo: number }, string>>>

// #endregion