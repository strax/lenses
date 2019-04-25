export interface SetterLike<S, A> {
  set(source: S, value: A): S
  update(source: S, f: (value: A) => A): S
}