import React, { Fragment } from 'react';
import { groups } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Header } from '../common/Header';
import { SVGBar } from '../common/SVGBar';
import { Standard } from '../common/Standard';
import { BooleanIcon } from '../common/BooleanIcon';

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
  const metricsValues = metrics.getAll(indicatorId);
  const { values, normalMedian, normalMax, standard } = metricsValues;
  const { value, normal, original, old, classification, intent } = values.find(d => d.commune === commune.cut);
  const isBoolean = intent === 'boolean';
  const max = Math.max(normalMax, standard.normal || 0);
  return (
    <div className={ clsx(style.indicator, els.col2) }>
      <div className={ style.bars }>
        { isBoolean && (
          <BooleanIcon valuie={value} />
        ) }
        { !isBoolean && (
          <Fragment>
            <SVGBar className="small" value={old.normal} real={old.value} max={max} cat={old.classification} />
            <SVGBar value={normal} real={value} desc={original} max={max} cat={ classification } />
            <SVGBar className="small gray" value={normalMedian} max={max} />
            {standard?.normal && (
              <Standard value={standard.normal} max={max} base={5} />
            )}
          </Fragment>
        ) }
      </div>
      <p>{ description }</p>
      { standard.type === 'std' && (
        <p className={style.standard}>Estándar: { standard.name }</p>
      ) }
    </div>
  );
}