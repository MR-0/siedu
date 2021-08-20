import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3';
import clsx from 'clsx';
import style from './SVGBar.module.scss';

const base = 5;
const getRect = (element, value, max) => {
  const rect = element?.getBoundingClientRect().toJSON() || {};
  const { width:rectWidth } = rect;
  const width = max && (base + (rectWidth - base) * value / max);
  return { ...rect, width };
};
const posText = (text, width) => {
  const bbox = text.node().getBBox();
  const over = width > bbox.width + base * 2 + 10;
  text
    .attr('x', over ? width - base : width + base)
    .attr('text-anchor', over ? 'end' : 'start')
  if (!over) text.attr('fill', '#222');
};

export const SVGBar = ({ className, value, real, desc, max, old, cat }) => {
  className = (className || '').split(' ').map(key => style[key]);
  const svg = useRef();
  const { bar:barStyle, icon } = style;
  const [ elements, setElements ] = useState({});
  const { width, height } = getRect(svg.current, value, max);
  const { bar, text } = elements;
  const fills = {
    high: '#EF6350',
    medium: '#F5A196',
    low: '#FCDAD5',
    zero: '#A8C366',
    undefined: 'transparent'
  };

  if (bar) bar
    .attr('x', 0)
    .attr('y', 1)
    .attr('height', height - 2)
    .attr('width', width)
    .attr('fill', fills[cat]);

  if (text) text
    .attr('y', (height + 22) * 0.5)
    .attr('dy', '-0.5em')
    .attr('fill', () => {
      if (cat === 'medium' || cat === 'low') return '#222';
      else return '#fff';
    })
    .call(posText, width);

  useEffect(() => {
    const bar = select(svg.current).append('rect');
    const text = select(svg.current).append('text');

    if (real !== undefined && !/small/.test(className)) {
      text
        .append('tspan')
        .text(real === null ? desc || 'Sin información' : real);
      text
        .append('tspan')
        .attr('class', 'evolution-icon ' + icon)
        .attr('dy', '0.15em')
        .attr('dx', '0.1em')
        .text(() => {
          if (old === undefined || old === null) return '';
          return value === old
            ? 'c'
            : value > old
            ? 'a'
            : 'b'
        });
    }

    setElements({ bar, text });
  }, []);

  return (
    <div className={ clsx( barStyle, className, 'svg-bar' ) }>
      <svg ref={ svg }></svg>
    </div>
  )
}