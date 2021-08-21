import React, { Fragment } from 'react';
import clsx from 'clsx';
import { SVGBar } from '../common/SVGBar';
import { Standard } from '../common/Standard';
import { BooleanIcon } from '../common/BooleanIcon';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';

export const Indicator = ({ data }) => {
  const { description, normalMedian, normalMax, standard, value, normal, original, old, classification, intent } = data;
  const isBoolean = intent === 'boolean';
  const max = Math.max(normalMax, standard.normal || 0);
  return (
    <div className={ clsx(style.indicator, els.col2) }>
      <div className={ style.bars }>
        { isBoolean && (
          <BooleanIcon valuie={value} />
        ) }
        { !isBoolean && (
          <Fragment>
            <SVGBar className="small" value={old.normal} real={old.value} max={max} cat={old.classification} />
            <SVGBar value={normal} real={value} desc={original} max={max} cat={ classification } />
            <SVGBar className="small gray" value={normalMedian} max={max} />
            {standard?.normal && (
              <Standard value={standard.normal} max={max} base={5} />
            )}
          </Fragment>
        ) }
      </div>
      <p>{ description }</p>
      { standard.type === 'std' && (
        <p className={style.standard}>Estándar: { standard.name }</p>
      ) }
    </div>
  );
};