import { at, At } from "./At";
import { Assert, Eq } from "./TestUtils";
import { Composition, ToObj } from "./TypeFunctions";
import { Lens } from "./Lens";

// #region Composing At with At

namespace Test$ComposingAtWithAt {
  const res = at("foo").compose(at("bar")).reify()
  type _ = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}

// #endregion

// #region Composing Lens with At

namespace Test$ComposingLensWithAt {
  declare const fst: Lens<[number, { foo: string }], { foo: string }>
  const res = fst.compose(at("foo"))
  type test = Assert<Eq<typeof res, Lens<[number, { foo: string }], string>>>
}

// #region