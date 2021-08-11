import React from 'react';
import clsx from 'clsx';
import { Chart } from './Chart';
import { styles as els } from 'elementary';
import styles from './Compromise.module.scss';

export const Compromise = ({ compromise, number, className, showTooltip, ...attrs }) => {
  const { holder, title, titleNumber, indicators } = styles
  const { row, col2, col4, middle, gutNo, fit } = els;
  const { name, attributes } = compromise;

  return (
    <div className={clsx(row, middle, holder, className)}>
      <div className={col2}>
        <div className={clsx(row, middle)}>
          <h5 className={title}>{name}</h5>
          <p className={clsx(fit, gutNo, titleNumber)}>
            {(number + '').padStart(2, '0')}
          </p>
        </div>
      </div>
      <div className={col4}>
        <Chart
          data={attributes}
          className={indicators}
          tooltip={ showTooltip }
          {...attrs}
        />
      </div>
    </div>
  );
};