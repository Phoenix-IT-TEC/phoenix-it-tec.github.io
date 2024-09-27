import * as React from 'react';
import type {
  LogicProps,
  VerticalMenuProps,
  VerticalMenuImperativeActions,
} from '../VerticalMenu.types';
import extendItemsWithSelectionProp from './utils/extendItemsWithSelectionProp';
import filterVisibleItems from './utils/filterVisibleItems';
import * as translationKeys from './constants';
import VerticalMenuCommonSkin from './skinComps/VerticalMenuCommonSkin';

const VerticalMenuRoot: React.ForwardRefRenderFunction<
  VerticalMenuImperativeActions,
  VerticalMenuProps & LogicProps
> = (props, ref) => {
  const { translations, items = [], currentUrl } = props;

  const visibleItems = React.useMemo(() => filterVisibleItems(items), [items]);
  const itemsWithSelectionProp = React.useMemo(
    () => extendItemsWithSelectionProp(currentUrl, visibleItems),
    [currentUrl, visibleItems],
  );

  const ariaLabel =
    translations.ariaLabel || translationKeys.ARIA_LABEL_DEFAULT;

  return (
    <VerticalMenuCommonSkin
      {...props}
      ref={ref}
      items={itemsWithSelectionProp}
      ariaLabel={ariaLabel}
    />
  );
};

export default React.forwardRef(VerticalMenuRoot);
