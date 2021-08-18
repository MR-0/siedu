import React from 'react';
import clsx from 'clsx';
import { useDataValue } from 'contexts/Data';
import { Chart } from './Chart';
import { styles as els } from 'elementary';
import styles from './Communes.module.scss';
import { group } from 'd3';

export const Communes = () => {
  const { communes } = useDataValue();
  const { row, col2, col4, gutNo, middle } = els;
  const sortedCommunes = communes.localValues.sort((a,b) => {
    return a.name > b.name
      ? 1
      : a.name.replace(/ñ/i, 'n') < b.name.replace(/ñ/i, 'n')
        ? -1
        : 0;
  });
  return sortedCommunes.map((commune, i) => {
    return (
      <div key={i} className={ clsx(row, middle, styles.communes) }>
        <div className={ clsx(col2, gutNo) }>
            <h5>{ commune.name }</h5>
        </div>
        <div className={ col4 }>
          <Chart className={ styles.stack } data={ commune.values } />
        </div>
      </div> 
    )
  });
};