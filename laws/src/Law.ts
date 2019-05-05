import { RunDetails } from "fast-check"
import format from "pretty-format"

type Executor<T> = () => Promise<Execution<T>> | Execution<T>

interface Execution<T> extends RunDetails<T> {}

class LawViolation<T> extends Error {
  constructor(private _name: string, private execution: Execution<T>) {
    super()
  }

  get name(): string {
    return "LawViolation"
  }

  get testedLawName(): string {
    return this._name
  }

  get message(): string {
    return `${this.execution.error} (in ${this.testedLawName})

Parameters: ${format(this.execution.counterexample, { indent: 2, highlight: true })}`
  }
}

export class Law<T> {
  constructor(readonly name: string, readonly executor: Executor<T>) {}

  async run() {
    const execution = await this.executor()
    if (execution.failed) {
      throw new LawViolation(this.name, execution)
    }
  }
}
