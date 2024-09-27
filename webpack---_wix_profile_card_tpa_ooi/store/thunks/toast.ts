import type { Thunk } from '../../types';

import { getHideToastAction } from '../actions/ui';

export const hideToast: Thunk = () => (dispatch) => {
  dispatch(getHideToastAction());
};
