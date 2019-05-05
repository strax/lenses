import { Prism, Lens } from "@lenses/core"

interface Foo {
  foo?: Bar
}

interface Bar {
  bar: string
  baz?: number
}

declare const foobar: Prism<Foo, Bar>

// #region Composing Prism with Lens
declare const bar: Lens<{ bar: string }, string>
// $ExpectType Affine<Foo, string>
foobar.compose(bar)
// #endregion

// #region Composing Prism with Prism
declare const barbaz: Prism<Bar, number>
// $ExpectType Prism<Foo, number>
foobar.compose(barbaz)
// #endregion
