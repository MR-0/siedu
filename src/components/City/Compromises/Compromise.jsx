import React from 'react';
import { groups, max } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Header } from '../common/Header';
import { SVGBar } from '../common/SVGBar';

import { styles as els } from 'elementary';
import style from './Compromise.module.scss';

export const Compromise  = ({ compromise }) => {
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
      { attributes.map((d,i) => <Attribute key={i} data={d} />) }
    </section>
  );
} 

const Attribute = ({ data }) => {
  const { name, icon, indicators } = data;
  const iconUrl = `./images/icons/${ icon }`;
  return (
    <div className={ style.compromise }>
      <h4>
        <i><img src={ iconUrl } alt="Icon" /></i>
        <span>{ name }</span>
      </h4>
      <div className={ els.row }>
        { indicators.map((d, i) => <Indicator key={i} data={d} />) }
      </div>
    </div>
  )
}

const Indicator = ({ data }) => {
  const { description, indicatorId:id, intent, isPrimary } = data;
  const { metrics } = useDataValue();
  const { values } = metrics.get(id);
  // console.log(data, values);
  return (
    <div className={ els.col2 }>
      <SVGBar value={10} real={10} max={30} />
      <p>{ description }</p>
    </div>
  );
}