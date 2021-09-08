import React, { useEffect, useState } from 'react';
import { Indicator } from './Indicator';
import { PrimaryIndicator } from './PrimaryIndicator';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';
import clsx from 'clsx';

export const Attribute = ({ attribute }) => {
  const [ iconSvg, setIconSvg ] = useState('');
  const { name, icon, indicators } = attribute;
  const primary = indicators.find(d => d.isPrimary);
  const others = indicators.filter(d => !d.isPrimary);
  const isOne = others.length === 1;

  useEffect(() => {
    (async () => {
      const response = await fetch(`./images/icons/${ icon }`);
      const result = await response.text();
      setIconSvg(result);
    })();
  }, [ icon ]);

  return (
    <div className={ style.compromise }>
      <h4>
        <i dangerouslySetInnerHTML={{ __html: iconSvg }}></i>
        <span>{ name }</span>
      </h4>
      {primary && <PrimaryIndicator data={ primary } />}
      <div className={ clsx(els.row, els.fit) }>
        { others.map((d, i) => (
          <Indicator key={i} data={d} isOne={ isOne } />
        )) }
      </div>
    </div>
  )
};