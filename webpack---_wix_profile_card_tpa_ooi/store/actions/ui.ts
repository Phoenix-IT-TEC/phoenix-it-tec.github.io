import uiSlice from '../slices/ui-slice';
import { ToastType } from '../../constants/toast';

export const getShowToastAction = (type: ToastType) =>
  uiSlice.actions.showToast({ type });

export const getHideToastAction = () => uiSlice.actions.hideToast(null);
