import React from 'react';
import { groups } from 'd3';
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
  const primary = indicators.find(d => d.isPrimary);
  const others = indicators.filter(d => !d.isPrimary);
  return (
    <div className={ style.compromise }>
      <h4>
        <i><img src={ iconUrl } alt="Icon" /></i>
        <span>{ name }</span>
      </h4>
      {primary && (
        <div>
          <p>Primario</p>
          <Indicator data={primary} commune={commune} />
          <hr />
          <br />
        </div>
      )}
      <div className={ clsx(els.row, els.fit) }>
        { others.map((d, i) => (
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
  const { value, intentded, original, old, standard } = values.find(d => d.commune === commune.cut);
  const std = [standard.value, standard.amount * 1];
  console.log(value, max);
  return (
    <div className={ clsx(style.indicator, els.col2) }>
      <div className={ style.bars }>
        <SVGBar className="small" value={old.intentded} max={max} std={std} />
        <SVGBar value={intentded} real={value} desc={original} max={max} std={std} />
        <SVGBar className="small gray" value={median} max={max} std={std} />
      </div>
      <p>{ description }</p>
      { standard.type === 'std' && (
        <p className={style.standard}>{ standard.name }</p>
      ) }
    </div>
  );
}