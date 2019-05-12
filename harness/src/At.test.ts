import { at } from "@lenses/core"

// #region Composing At with At
// $ExpectType At<Compose<Ix<"foo">, Ix<"bar">>>
at("foo")
  .compose(at("bar"))
  .reify()
// #endregion

// #region Inferring the value type of composite At
// $ExpectType "value"
at("foo")
  .compose(at("bar"))
  .get({ foo: { bar: "value" as const } })
// #endregion

// #region At#compose returns a composite At
// $ExpectType At<Compose<Ix<"foo">, Ix<"bar">>>
at("foo")
  .compose(at("bar"))
  .reify()
// #endregion
