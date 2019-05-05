import { at } from "@lenses/core"

// Composing At with At
// $ExpectType At<Composition<ToObj<"foo">, ToObj<"bar">>>
at("foo")
  .compose(at("bar"))
  .reify()

// Inferring the value type of composite At
// FIXME: Value type of the optic should be inferred from the source argument
// FIXME: $ExpectType "value"
at("foo")
  .at("bar")
  .get({ foo: { bar: "value" as const } })

// At#at returns a composite At
// $ExpectType At<Composition<ToObj<"foo">, ToObj<"bar">>>
at("foo")
  .at("bar")
  .reify()
