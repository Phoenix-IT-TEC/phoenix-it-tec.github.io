import { createSlice } from '@reduxjs/toolkit';

import { ToastType } from '../../constants/toast';
import type { Reducer, InjectedUI } from '../../types';

type SetShowToastPayload = Pick<InjectedUI['toast'], 'type'>;

const name = 'ui';

const initialState: InjectedUI = {
  toast: {
    type: ToastType.None,
    isVisible: false,
  },
};

const showToast: Reducer<InjectedUI, SetShowToastPayload> = (
  state,
  { payload },
) => ({
  ...state,
  toast: {
    type: payload.type,
    isVisible: true,
  },
});

const hideToast: Reducer<InjectedUI> = (state) => ({
  ...state,
  toast: {
    type: ToastType.None,
    isVisible: false,
  },
});

const reducers = {
  showToast,
  hideToast,
};

const uiSlice = createSlice({ name, initialState, reducers });

export default uiSlice;
