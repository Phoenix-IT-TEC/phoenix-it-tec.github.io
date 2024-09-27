import { bindActionCreators, configureStore } from '@reduxjs/toolkit';

import { ThunkExtra } from '../types';
import rootReducer from './root-reducer';
import * as thunks from './thunks';

const createStore = (extraArgument: ThunkExtra) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          isSerializable: () => true,
        },
        thunk: { extraArgument },
      }),
  });

  return store;
};

export type Store = ReturnType<typeof createStore>;

export const bindThunksToStore = (store: Store) =>
  bindActionCreators(thunks, store.dispatch);

export default createStore;
