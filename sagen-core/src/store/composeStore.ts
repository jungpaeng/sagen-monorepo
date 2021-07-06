import { createStore, CreateStore } from './createStore';

interface ComposeStore<StoreMap extends Record<string, any>> {
  store: CreateStore<StoreMap>;
  unSyncStore: () => void;
}

export function composeStore<ComposedStore extends Record<string, any>>(
  storeMap: Record<string, CreateStore>,
): ComposeStore<ComposedStore> {
  const storeMapKeys: string[] = [];
  const subscribeList: Array<() => void> = [];
  const storeState: ComposedStore = {} as ComposedStore;

  // change compose store when changed original store
  for (const key in storeMap) {
    if (storeMap.hasOwnProperty(key)) {
      const subscribe = storeMap[key].onSubscribe((next) => {
        const composedState = composedStore.getState();
        if (composedState[key] !== next)
          composedStore.setState((curr) => ({ ...curr, [key]: next }));
      });

      storeMapKeys.push(key);
      subscribeList.push(subscribe);
      storeState[key as keyof ComposedStore] = storeMap[key].getState();
    }
  }

  // change original store when changed compose store
  const composedStore = createStore(storeState);
  const composedStoreSubscribe = composedStore.onSubscribe((next, prev) => {
    storeMapKeys.forEach((key) => {
      if (next[key] !== prev[key] && storeMap[key].getState() !== next[key])
        storeMap[key].setState(next[key]);
    });
  });

  subscribeList.push(composedStoreSubscribe);

  function unSyncStore() {
    subscribeList.forEach((subscribe) => subscribe());
  }

  return { store: composedStore, unSyncStore };
}
