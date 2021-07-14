import React, { useCallback, useEffect, useRef, useState } from 'react';
import { max, median, select } from 'd3';
import clsx from 'clsx';
import { SVGBar } from '../common/SVGBar';
import { styles as els } from 'elementary';
import style from './Compromise.module.scss';

export const Compromise = ({ data }) => {
  const { holder } = style;
  const { number, name, indicators, noIndicatorsBreachesMsg } = data;
  return (
    <div className={holder}>
      <Head number={number} name={name} />
      { !!indicators.length && <Body indicators={indicators} /> }
      { !indicators.length && (
        <div>
          <br />
          <p className={ els.textCenter }>{noIndicatorsBreachesMsg}</p>
        </div>
      ) }
    </div>
  )
}

const Head = ({ number, name }) => {
  const { head } = style;
  const { row, middle, col1, col2, col3, gutSm } = els;
  const padNumber = String(number).padStart(2, '0');
  return (
    <div className={head}>
      <div className={clsx(row, middle)}>
        <div className={col2}>
          <h4>Compromiso {padNumber}</h4>
        </div>
        <div className={clsx(col3, gutSm)}>
          <p>{name}</p>
        </div>
        <div className={col1}>&nbsp;</div>
      </div>
    </div>
  );
};

const Body = ({ indicators }) => {
  const [icon, setIcon] = useState(null);
  const { row, col2, col4 } = els;
  const { body, bars, description } = style;
  const worst = indicators
    // .filter(d => d.median > 0)
    // Only no city level
    .filter(d => !d.hasOnlyCity)
    .filter(d => d.values.length)
    .sort((a, b) => a.median > b.median ? 1 : a.median < b.median ? -1 : 0)
  const worstest = worst[0];
  const worstestValues = worstest?.values
    .sort((a, b) => {
      return a.intentded > b.intentded ? 1 : a.intentded < b.intentded ? -1 : 0
    }) 
    .slice(0,10) || [];
  const standard = worstest?.values[0].standard;

  if (worstest) {
    const { attributeIcon, nationalMax, nationalMedian } = worstest;
    const maxValue = max(worstestValues, d => d.value);

    // console.log(standard, maxValue);

    if (!icon) fetch('./images/icons/' + attributeIcon)
      .then(response => response.text())
      .then(result => {
        const holder = document.createElement('div');
        holder.innerHTML = result;
        const svg = select(holder.childNodes[0]);
        const viewbox = svg.attr('viewBox').split(' ').slice(2);
        const [width, height] = viewbox.map(d => d * 1);
        svg.attr('id', null);
        svg.attr('width', width);
        svg.attr('height', height);
        setIcon(svg.node().outerHTML);
      });
    return (
      <div className={body}>
        <div className={clsx(row, els.gutSm)}>
          <div className={clsx(description, col2)}>
            <i dangerouslySetInnerHTML={{ __html: icon }}></i>
            <h4>{worstest.compromiseName}</h4>
            <p>{worstest.description}</p>
          </div>
          <div className={col4}>
            <ul className={bars}>
              <Bar
                className="small gray"
                data={{
                  communeName: 'Mejor indicador nacional',
                  intentded: nationalMax
                }}
                max={nationalMax}
              />
              {worstestValues
                .map((d) => <Bar key={d.code +'-'+ d.commune +'-'+ d.year} data={d} max={nationalMax} />
                )}
              <Bar
                className="small gray"
                data={{
                  communeName: 'Media nacional',
                  intentded: nationalMedian
                }}
                max={nationalMax}
              />
            </ul>
            {(standard && standard.value !== null) && (
              <Standard value={standard.value} max={maxValue} base={5} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const Standard = ({ value, max, base }) => {
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

const Bar = ({ className, data, max }) => {
  const { row, middle, col3, gutSm } = els;
  const { bar } = style;
  const { communeName: name, intentded: value, value: real } = data;
  const old = data.old?.intentded;

  return (
    <li className={clsx(bar, row, middle, gutSm, className)}>
      <h5 className={col3}>{name}</h5>
      <div className={col3}>
        <SVGBar {...{ className, value, real, max, old }} />
      </div>
    </li>
  )
}