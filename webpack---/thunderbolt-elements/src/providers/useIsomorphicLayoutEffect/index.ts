import { useLayoutEffect, useEffect } from 'react';
import { isBrowser } from '@wix/editor-elements-common-utils';

export const useIsomorphicLayoutEffect = isBrowser()
  ? useLayoutEffect
  : useEffect;
