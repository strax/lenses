import { Lens } from "./Lens";
import { Iso } from "./Iso";
import { at } from "./At";
import { TypeFunction2 } from "./TypeFunctions";
import { ComposeAt } from "./ComposeAt";

declare const x: Lens<{ foo: string }, string>
declare const iso: Iso<string, number>
x.compose(iso)

iso.compose(iso.inverse())
declare const firstChar: Lens<string, [string]>
iso.inverse().compose(firstChar)

at("foo").compose(at("bar"))
at("foo").compose(iso)

iso.composeAt(at("foo"))

function intoComposeAt<S extends TypeFunction2, T>(cat: ComposeAt<S, T>) {
  return cat
}

const cat = intoComposeAt(iso)