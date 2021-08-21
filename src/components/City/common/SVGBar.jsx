import React, { useState, useEffect, useRef } from 'react';
import { select } from 'd3';
import clsx from 'clsx';
import style from './SVGBar.module.scss';

const posText = (text, width, base) => {
  const bbox = text.node().getBBox();
  const over = width > bbox.width + base * 2 + 10;
  text
    .attr('x', over ? width - base : width + base)
    .attr('text-anchor', over ? 'end' : 'start')
  if (!over) text.attr('fill', '#222');
};

const fills = {
  high: '#EF6350',
  medium: '#F5A196',
  low: '#FCDAD5',
  zero: '#A8C366',
  undefined: 'transparent'
};

const textFills = {
  high: '#FFF',
  medium: '#222',
  low: '#222',
  zero: '#FFF',
  undefined: '#222'
};

export const SVGBar = ({ className, value, real, desc, max, old, cat, base = 5 }) => {
  className = (className || '').split(' ').map(key => style[key]);
  const svg = useRef();
  const { bar:barStyle, icon } = style;
  const [ rect, setRect ] = useState({});
  const [ elements, setElements ] = useState({});
  const { bar, text } = elements;
  const width = max && (base + ((rect.width - base) * value / max));

  if (bar) bar
    .attr('x', 0)
    .attr('width', width)
    .attr('fill', fills[cat]);

  if (text) text
    .attr('fill', textFills[cat])
    .call(posText, width, base);

  useEffect(() => {
    const rect = svg.current.getBoundingClientRect();
    const bar = select(svg.current)
      .append('rect')
      .attr('y', 1)
      .attr('height', rect.height - 2);
    const text = select(svg.current)
      .append('text')
      .attr('y', (rect.height + 22) * 0.5)
      .attr('dy', '-0.5em');

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

    setRect(rect);
    setElements({ bar, text });
  }, []);

  return (
    <div className={ clsx( barStyle, className, 'svg-bar' ) }>
      <svg ref={ svg }></svg>
    </div>
  )
}