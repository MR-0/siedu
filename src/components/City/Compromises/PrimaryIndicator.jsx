import React, { useState } from 'react';
import { ArcSvg } from '../common/ArcSvg';
import { ArcStandard } from '../common/ArcStandard';
import { Tooltip } from '../common/Tooltip';

import { styles as els } from 'elementary';
import style from './PrimaryIndicator.module.scss';
import indicatorStyle from './Compromise.module.scss';
import clsx from 'clsx';

const formatNum = num => (num * 1)
  .toLocaleString('en-US')
  .replace(/,/g, '\u202F');

export const PrimaryIndicator = ({ data }) => {
  const [ tooltipData, setTooltipData ] = useState(null);
  const { normal, normalMax, classification, old, normalMedian, standard, description, original: uglyOriginal, unit: uglyUnit } = data;
  const part = 0.82;
  const angle = normal * Math.PI * part / normalMax;
  const oldAngle = old.normal * Math.PI * part / old.normalMax;
  const medianAngle = normalMedian * Math.PI * part / normalMax;
  const std = standard?.normal;
  const stdAngle = std && (std * Math.PI * part / normalMax);
  let original = uglyOriginal;
  original = isNaN(original * 1) ? original : formatNum(original);
  const unit = uglyUnit.replace(/\d+/, n => formatNum(n));
  const isSmallUnit = ['%', 'm', 'ha'].some(d => d === unit);
  const handleHover = (e) => {
    e.stopPropagation();
    setTooltipData({ ...data, old: data.old?.value, standard: data.standard?.value });
  };
  return (
    <div>
      <div className={ style.holder }>
        <svg
          className="chart-gauge"
          height="240"
          width="620"
          onMouseOver={ handleHover }
        >
          <ArcSvg
            label="Medición Anterior"
            angle={ oldAngle }
            type={ old.classification }
            radius={ 200 }
            width={ 10 }
          />
          <ArcSvg
            label="Medición Actual"
            angle={ angle }
            type={ classification }
            radius={ 180 }
            width={ 20 }
          />
          <ArcSvg
            label="Mediana nacional"
            angle={ medianAngle }
            radius={ 160 }
            width={ 10 }
          />
          { stdAngle && (
            <ArcStandard
              className={ style.standard }
              angle={ stdAngle }
              radius={ 180 }
              width={ 70 }
            />
          )}
        </svg>
        <dl className={ clsx(style.value, style[classification]) }>
          <dd>
            <span>{ original }</span>
            { isSmallUnit && <span className={ style.unit }>{ unit }</span> }
          </dd>
          { !isSmallUnit && <dt>{ unit }</dt> }
        </dl>
      </div>
      <div className={ clsx(els.max500, els.blockCenter, els.mar ) }>
        <p className={ clsx(els.textCenter, els.textLg, els.marSm ) }>{ description }</p>
        { standard.type === 'std' && (
          <p className={indicatorStyle.standard}>Estándar: { standard.name }</p>
        ) }
      </div>
      <Tooltip show={ !!tooltipData }>
        { Object.entries(tooltipData || {}).map(([key, value]) => (
          <p>{key} : {value}</p>
        ))}
      </Tooltip>
    </div>
  )
}