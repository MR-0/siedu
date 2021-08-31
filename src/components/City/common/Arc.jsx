import React, { useRef, useState, useEffect } from 'react';
import { arc, select } from 'd3';
import clsx from 'clsx';
import style from './Arc.module.scss';

let count = 0;

export const Arc = ({ radius, width, angle, type, label, ...attrs }) => {
  const ref = useRef();
  const [ rect, setRect ] = useState({});
  const [ path, setPath ] = useState(null);
  const arcValue = arc()({
    innerRadius: radius - width * 0.5,
    outerRadius: radius + width * 0.5,
    startAngle: 0 - Math.PI * 0.5,
    endAngle: angle - Math.PI * 0.5
  });

  path && path
    .attr('class', clsx(style.bar, style[type] ))
    .attr('d', arcValue);

  useEffect(() => {
    const svg = select(ref.current);
    const rect = ref.current.getBoundingClientRect();
    const href = 'text-path-' + Date.now() + '-' + count;
    const { width, height } = rect;
    const group = svg.append('g')
      .attr('transform', `translate(${ width *0.5 }, ${ height })`);
    const guide = group
      .append('path')
      .attr('class', style.guide)
      .attr('transform', 'translate(0, 1)')
      .attr('d', arc()({
        innerRadius: 0,
        outerRadius: radius + 1,
        startAngle: 0 - Math.PI * 0.5,
        endAngle: Math.PI * 0.5
      }));
    const textGuide = group
      .append('path')
      .attr('id', href)
      .attr('d', arc()({
        innerRadius: radius + 5,
        outerRadius: radius + 5,
        startAngle: 0 - Math.PI * 0.5,
        endAngle: Math.PI * 0.5
      }));
    const path = group.append('path');
    const text = group
      .append('text')
      .attr('y', '5em');
    const textPath = text
      .append('textPath')
      .attr('href', `#${ href }`)
      .attr('startOffset', '50%')
      .text(label);
    setPath(path);
    setRect(rect);
    count++;
  }, []);

  return <svg
    { ...attrs }
    className={ style.arc }
    height={ radius + width * 0.5 + 1 }
    width={ rect.width }
    viewBox={ `0 0 ${ rect.width || 0 } ${ rect.height || 0 }`}
    ref={ ref } ></svg>;
};