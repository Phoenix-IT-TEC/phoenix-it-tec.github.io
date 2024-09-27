import { I$WWrapper } from '../types';
import { APP_WIDGET_LOGIN_MENU_ID } from '../constants';

export const getLoginBarMenu = ($w: I$WWrapper) => $w(APP_WIDGET_LOGIN_MENU_ID);
