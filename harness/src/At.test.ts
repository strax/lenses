import { at, At } from "@lenses/core"
import { Assert, Eq } from "./TestUtils"
import { Composition, ToObj } from "@lenses/core/src/TypeFunctions"

// #region Composing At with At
namespace Test$CompositionWithAt {
  const res = at("foo")
    .compose(at("bar"))
    .reify()
  type _ = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}
// #endregion

// #region Inferring the value type of composite At
namespace Test$CompositeAtValueInference {
  const res = at("foo")
    .at("bar")
    .get({ foo: { bar: "value" as const } })
  // @ts-ignore FIXME: Value type of the optic should be inferred from the source argument
  type _ = Assert<Eq<typeof res, "value">>
}
// #endregion

// #region At#at returns a composite At
namespace Test$AtAtReturnsCompositeAt {
  const res = at("foo")
    .at("bar")
    .reify()
  type _ = Assert<Eq<typeof res, At<Composition<ToObj<"foo">, ToObj<"bar">>>>>
}
// #endregion
