export type Assert<T extends true> = void
export type Eq<A, B> = [A] extends [B] ? [B] extends [A] ? true : false : false