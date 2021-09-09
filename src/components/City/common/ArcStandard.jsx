import React, { useRef, useState, useEffect } from 'react';
import { select } from 'd3';

import style from './ArcStandard.module.scss';
import clsx from 'clsx';

export const ArcStandard = ({ radius, width, angle, className }) => {
  const ref = useRef();
  const [ line, setLine ] = useState(null);
  const [ text, setText ] = useState(null);
  const endAngle = Math.PI - angle;
  const cos = Math.cos(endAngle);
  const sin = Math.sin(endAngle);
  const isOverHalf = endAngle > Math.PI * 0.5;

  if (line) line
    .attr('x1', cos * (radius - width * 0.5))
    .attr('x2', cos * (radius + width * 0.5))
    .attr('y1', sin * (width * 0.5 - radius))
    .attr('y2', sin * (0 - width * 0.5 - radius))
    .attr('stroke', '#000');

  if (text) text
    .attr('x', cos * (radius + width * 0.5))
    .attr('y', sin * (0 - width * 0.5 - radius))
    .attr('dx', isOverHalf ? '-0.25em' : '0.25em')
    .attr('text-anchor', isOverHalf ? 'end' : 'start');

  useEffect(() => {
    const svg = select(ref.current);
    const { width, height } = ref.current.getBoundingClientRect();
    const group = svg
      .append('g')
      .attr('transform', `translate(${ width * 0.5 }, ${ height })`)
    const line = group.append('line');
    const text = group
      .append('text')
      .attr('dy', '0.25em')
      .text('Estándar');
    setLine(line);
    setText(text);
  }, []);

  return <svg
    className={ clsx(style.svg, className) }
    height={ radius + width * 0.5 + 1 }
    width={ radius + width * 0.5 + 1 }
    ref={ ref }></svg>;
}