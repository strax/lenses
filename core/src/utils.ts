export type Fields<T> = keyof T extends infer K
  ? (K extends keyof T ? (T[K] extends Function ? never : K) : never)
  : never

/**
 * Like `NonNullable<T>`, but removes only `undefined` part of the type.
 */
export type Strict<A> = A extends undefined ? never : A
