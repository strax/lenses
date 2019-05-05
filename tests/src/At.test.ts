import { At, at } from "@lenses/core"
import { LensLaws } from "@lenses/laws"
import { anything, record, string } from "fast-check"

describe("at(key)", () => {
  it("is a valid Lens", async () => {
    const arbA = anything()
    const arbFoo = record({ foo: anything() })
    await LensLaws.runLaws(at("foo"), arbFoo, arbA)
  })

  describe("composition with At", () => {
    it("results in a valid Lens", async () => {
      const optic = at("foo").compose(at("bar"))
      const arbA = anything()
      const arbFooBar = record({ foo: record({ bar: anything() }) })
      await LensLaws.runLaws(optic, arbFooBar, arbA)
    })
  })
})
