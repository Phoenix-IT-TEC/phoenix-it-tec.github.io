import React from 'react';
import type {
  ILinkContent,
  IVerticalAnchorsMenuProps,
} from '../../../VerticalAnchorsMenu.types';
import VerticalAnchorsMenuCommonSkin from '../VerticalAnchorsMenuCommonSkin';
import styles from './styles/skins.scss';

const linkContent = (props: ILinkContent) => {
  const { label, id } = props;
  return (
    <>
      <svg className={styles.symbol} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
      </svg>
      <span className={styles.label}>
        <span id={id} className={styles.padding}>
          {label}
        </span>
      </span>
    </>
  );
};

const VerticalAnchorsMenuSymbolWithHiddenTextSkin: React.FC<
  IVerticalAnchorsMenuProps
> = props => {
  return (
    <VerticalAnchorsMenuCommonSkin
      {...props}
      style={styles}
      skin="VerticalAnchorsMenuSymbolWithHiddenTextSkin"
      linkContent={linkContent}
    />
  );
};

export default VerticalAnchorsMenuSymbolWithHiddenTextSkin;
