import React, { useEffect, useRef } from 'react';
import { select } from 'd3';
import clsx from 'clsx';
import { styles as els } from 'elementary';
import style from './Standard.module.scss';

export const Standard = ({ value, max, base }) => {
  const svg = useRef();
  const { row, col3, gutSm } = els;
  const { standard } = style;

  useEffect(() => {
    const rect = svg.current.getBoundingClientRect().toJSON();
    const { width, height } = rect;
    const result = base + (width - base) * value / max;
    const bar = select(svg.current)
      .append('line')
      .attr('x1', (max && result) || 0)
      .attr('x2', (max && result) || 0)
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#000')
  }, []);

  return (
    <div className={standard}>
      <div className={clsx(row, gutSm)}>
        <div className={col3}>&nbsp;</div>
        <div className={col3}>
          <svg ref={svg}></svg>
        </div>
      </div>
    </div>
  )
}