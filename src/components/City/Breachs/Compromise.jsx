import React, { useEffect, useRef, useState } from 'react';
import { select } from 'd3';
import clsx from 'clsx';
import { SVGBar } from '../common/SVGBar';
import { Standard } from '../common/Standard';
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
  const { standard } = worstest;
  const worstestValues = worstest.values
    .filter(d => d.normal !== null)
    .sort((a, b) => a.normal > b.normal ? 1 : a.normal < b.normal ? -1 : 0)
    .slice(0,10) || [];

  if (worstest) {
    const { attributeIcon, normalMax, normalMedian } = worstest;
    const maxValue = Math.max(normalMax, standard?.normal || 0);

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
                  normal: maxValue
                }}
                max={maxValue}
              />
              {worstestValues
                .map((d) => <Bar key={d.code +'-'+ d.commune +'-'+ d.year} data={d} max={100} />
                )}
              <Bar
                className="small gray"
                data={{
                  communeName: 'Media nacional',
                  normal: normalMedian
                }}
                max={maxValue}
              />
            </ul>
            {(standard.normal !== null) && (
              <Standard
                value={standard.normal}
                max={maxValue}
                base={5}
                />
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const Bar = ({ className, data, max }) => {
  const { row, middle, col3, gutSm } = els;
  const { bar } = style;
  // console.log('-->', data);
  const { communeName, normal, value, original, intent, classification } = data;
  const old = data.old?.normal;
  const real = intent === 'boolean' ? original : value;
  const attrs = {
    className,
    value: normal,
    real,
    max,
    old,
    cat: classification
  }

  return (
    <li className={clsx(bar, row, middle, gutSm, className)}>
      <h5 className={col3}>{ communeName }</h5>
      <div className={col3}>
        <SVGBar { ...attrs } />
      </div>
    </li>
  )
}