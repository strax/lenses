import { Lens } from "./Lens";
import { Iso } from "./Iso";
import { At } from "./At";

declare const x: Lens<{ foo: string }, string>
declare const iso: Iso<string, number>
x.compose(iso)

iso.compose(iso.inverse())
declare const firstChar: Lens<string, [string]>
iso.inverse().compose(firstChar)

const atFoo = new At("foo")

const composite1 = atFoo.compose(iso) // Lens<Record<"foo", string>, number>