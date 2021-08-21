import React from 'react';
import { Indicator } from './Indicator';
import { PrimaryIndicator } from './PrimaryIndicator';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';
import clsx from 'clsx';

export const Attribute = ({ attribute }) => {
  const { name, icon, indicators } = attribute;
  const iconUrl = `./images/icons/${ icon }`;
  const primary = indicators.find(d => d.isPrimary);
  const others = indicators.filter(d => !d.isPrimary);
  return (
    <div className={ style.compromise }>
      <h4>
        <i><img src={ iconUrl } alt="Icon" /></i>
        <span>{ name }</span>
      </h4>
      {primary && <PrimaryIndicator data={ primary } />}
      <div className={ clsx(els.row, els.fit) }>
        { others.map((d, i) => (
          <Indicator key={i} data={d} />
        )) }
      </div>
    </div>
  )
};