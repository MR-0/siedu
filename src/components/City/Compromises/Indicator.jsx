import React, { useState, Fragment } from 'react';
import clsx from 'clsx';
import { SVGBar } from '../common/SVGBar';
import { Standard } from '../common/Standard';
import { BooleanIcon } from '../common/BooleanIcon';
import { Tooltip } from '../common/Tooltip';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';

export const Indicator = ({ data, isOne }) => {
  const [ tooltipData, setTooltipData ] = useState(null);
  const { description, normalMedian, normalMax, standard, value, normal, original, old, classification, intent } = data;
  const isBoolean = intent === 'boolean';
  const max = Math.max(normalMax, standard.normal || 0);
  const handleHover = (e) => {
    e.stopPropagation();
    setTooltipData({ ...data, old: data.old?.value, standard: data.standard?.value });
  };
  return (
    <div
    className={ clsx(style.indicator, !isOne && els.col2, isOne && els.col4) }
    onMouseOver={ handleHover }
    >
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
      <Tooltip show={ !!tooltipData }>
        { Object.entries(tooltipData || {}).map(([key, value]) => (
          <p>{key} : {value}</p>
        ))}
      </Tooltip>
    </div>
  );
};