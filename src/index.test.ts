import { Lens } from "./Lens";
import { Iso } from "./Iso";
import { at } from "./At";

declare const x: Lens<{ foo: string }, string>
declare const iso: Iso<string, number>
x.compose(iso)

iso.compose(iso.inverse())
declare const firstChar: Lens<string, [string]>
iso.inverse().compose(firstChar)

at("foo").compose(at("bar"))

const atFoo = at("foo").compose(iso)
iso.composeAt(at("foo"))

const composite1 = atFoo.compose(iso) // Lens<Record<"foo", string>, number>