export interface Review<T, B> {
  review(b: B): T
}

class Upto<T, B> implements Review<T, B> {
  constructor(private f: (b: B) => T) {}

  review(b: B): T {
    return this.f(b)
  }
}

export function upto<T, B>(f: (b: B) => T): Review<T, B> {
  return new Upto(f)
}
