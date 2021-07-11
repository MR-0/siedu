import React from 'react';
import clsx from 'clsx';
import { styles as els } from 'elementary';
import styles from './Header.module.scss';
import { useConfigValue } from 'contexts/Config';

export const Header = ({ children, subtitle, number }) => {
  const { city } = useConfigValue();
  const { header, description, number:numberStyle } = styles;
  
  return (
    <div className={ header }>
      <div className={ els.row }>
        <div className={ els.col2 }></div>
        <div className={ els.col4 }>
          <h2 className={ clsx(els.textLight, els.textUppercase) }>
            <span>{ city?.name }</span>
          </h2>
        </div>
      </div>
      <div className={ els.row }>
        <div className={ clsx(els.col2, els.gutNo ) }>
          { number && <p className={ numberStyle }>
            <span>{ (number + '').padStart(2, '0') }</span>
          </p> }
        </div>
        <div className={ els.col4 }>
          { subtitle && <h3>{ subtitle }</h3> }
          <div className={ description }>
            { children }
          </div>
        </div>
      </div>
    </div>
  );
} 