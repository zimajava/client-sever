type Options<T> = { initialState: T };

type Fn = () => void;

type Store<T> = {
  state: T;
  setState: (newState: T) => void;
  getState: () => T;
  listeners: Set<Fn>;
  subscribe: (cb: Fn) => () => boolean;
};

export function createStore<T>(opts: Options<T>): Store<T> {
  const { initialState } = opts;

  const store: Store<T> = {
    state: initialState,
    setState(newState) {
      store.state = newState;
      store.listeners.forEach((listener) => listener());
    },
    getState() {
      return store.state;
    },
    listeners: new Set<() => void>(),
    subscribe(cb) {
      store.listeners.add(cb);
      return () => store.listeners.delete(cb);
    },
  };

  return store;
}
