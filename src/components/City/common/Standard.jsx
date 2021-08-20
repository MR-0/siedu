import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3';
import style from './Standard.module.scss';

export const Standard = ({ value, max, base }) => {
  const svg = useRef();
  const [ rect, setRect ] = useState({});
  const [ line, setLine ] = useState(null);
  const { standard } = style;
  const width = max && (base + ((rect.width - base) * value / max));

  console.log('standard ->', rect.width);
  
  if (line) line
    .attr('x1', width)
    .attr('x2', width)

  useEffect(() => {
    const rect = svg.current.getBoundingClientRect();
    const line = select(svg.current)
      .append('line')
      .attr('y1', 0)
      .attr('y2', rect.height)
      .attr('stroke', '#000');
    setRect(rect);
    setLine(line);
  }, []);

  return (
    <div className={standard}>
      <svg ref={svg}></svg>  
    </div>
  )
}