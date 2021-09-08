import React from 'react';
import { groups } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Header } from '../common/Header';
import { Attribute } from './Attribute';

export const Compromise  = ({ compromise, commune }) => {
  const { metrics } = useDataValue();
  const { description, name, indicators, number } = compromise;
  const attributes = groups(indicators, d => d.attribute)
    .map(([name, values]) => {
      const icon = values[0].attributeIcon;
      const isFirst = values.some(d => d.isPrimary);
      const indicators = values.map(indicator => {
        const { indicatorId: id } = indicator;
        const { values, normalMedian, normalMax, standard } = metrics.getAll(id);
        const item = values.find(d => d.commune === commune.cut);
        return { ...indicator, ...item, normalMedian, normalMax, standard };
      })
      return { name, icon, indicators, isFirst };
    })
    .sort((a, b) => a.isFirst ? -1 : b.isFirst ? 1 : 0);
  
  return (
    <section className="print-long">
      <Header subtitle={ name } number={ number }>
        <p>{ description }</p>
      </Header>
      { attributes.map((d,i) => <Attribute key={i} attribute={d} />) }
    </section>
  );
};