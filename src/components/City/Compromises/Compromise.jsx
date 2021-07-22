import React from 'react';
import { groups, max } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Header } from '../common/Header';
import { SVGBar } from '../common/SVGBar';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';
import clsx from 'clsx';

export const Compromise  = ({ compromise, commune }) => {
  const { description, name, indicators, number } = compromise;
  const attributes = groups(indicators, d => d.attribute)
    .map(([name, indicators]) => {
      const icon = indicators[0].attributeIcon;
      return { name, icon, indicators }
    });
  return (
    <section>
      <Header subtitle={ name } number={ number }>
        <p>{ description }</p>
      </Header>
      { attributes.map((d,i) => (
        <Attribute
          key={i}
          attribute={d}
          commune={commune}
        />
      )) }
    </section>
  );
} 

const Attribute = ({ attribute, commune }) => {
  const { name, icon, indicators } = attribute;
  const iconUrl = `./images/icons/${ icon }`;
  return (
    <div className={ style.compromise }>
      <h4>
        <i><img src={ iconUrl } alt="Icon" /></i>
        <span>{ name }</span>
      </h4>
      <div className={ clsx(els.row, els.fit) }>
        { indicators.map((d, i) => (
          <Indicator key={i} data={d} commune={commune} />
        )) }
      </div>
    </div>
  )
}

const Indicator = ({ data, commune }) => {
  const { metrics } = useDataValue();
  const { description, indicatorId } = data;
  const { values, median, max } = metrics.getAll(indicatorId);
  const value = values.find(d => d.commune === commune.cut);
  // console.log(value, max);
  return (
    <div className={ els.col2 }>
      <div className="asd">
        <SVGBar className="small" value={value.old.intentded} max={max} />
        <SVGBar value={value.intentded} real={value.value} desc={value.original} max={max} />
        <SVGBar className="small gray" value={median} max={max} />
      </div>
      <p>{ description }</p>
    </div>
  );
}