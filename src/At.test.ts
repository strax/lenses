import { at, At } from "./At";
import { Assert, Eq } from "./TestUtils";
import { Composition, ToObj } from "./TypeFunctions";
import { Lens } from "./Lens";

// #region Composing At with At

namespace Test$CompositionWithAt {
  const res = at("foo").compose(at("bar")).reify()
  type _ = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}

// #endregion

namespace Test$CompositeAtValueInference {
  const res = at("foo").at("bar").get({ foo: {bar: "value" as const }})
  // @ts-ignore FIXME: Value type of the optic should be inferred from the source argument
  type _ = Assert<Eq<typeof res, "value">>
}