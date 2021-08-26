import React from 'react';
import { Arc } from '../common/Arc';
import { ArcStandard } from '../common/ArcStandard';

import { styles as els } from 'elementary';
import style from './PrimaryIndicator.module.scss';
import clsx from 'clsx';

export const PrimaryIndicator = ({ data }) => {
  const { normal, normalMax, classification, old, normalMedian, standard, description, original: uglyOriginal, unit } = data;
  const part = 0.82;
  const angle = normal * Math.PI * part / normalMax;
  const oldAngle = old.normal * Math.PI * part / old.normalMax;
  const medianAngle = normalMedian * Math.PI * part / normalMax;
  const std = standard?.normal;
  const stdAngle = std && (std * Math.PI * part / normalMax);
  console.log('-->', data.attributeOrd, std, normalMax, stdAngle * 180 / Math.PI);
  let original = uglyOriginal;
  original = isNaN(original * 1) ? original : (original * 1).toLocaleString('ES-CL');
  return (
    <div>
      <div className={ style.holder }>
        <Arc
          label="Medición Anterior"
          angle={ oldAngle }
          type={ old.classification }
          radius={ 200 }
          width={ 10 }
        />
        <Arc
          label="Medición Actual"
          angle={ angle }
          type={ classification }
          radius={ 180 }
          width={ 20 }
        />
        <Arc
          label="Mediana nacional"
          angle={ medianAngle }
          radius={ 160 }
          width={ 10 }
        />
        <dl className={ clsx(style.value, style[classification]) }>
          <dd>{ original }</dd>
          <dt>{ unit }</dt>
        </dl>
        { stdAngle && (
          <ArcStandard
            angle={ stdAngle }
            radius={ 180 }
            width={ 70 }
          />
        )}
      </div>
      <div className={ clsx(els.max500, els.blockCenter ) }>
        <p className={ clsx(els.textCenter, els.textLg ) }>{ description }</p>
      </div>
    </div>
  )
}