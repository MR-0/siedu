import React from 'react';
import { max } from 'd3';
import { nameGroups } from '../../../contexts/Data/utils'
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

export const Compromises = () => {
  const { compromises, metrics } = useDataValue();
  const fullCompromises = compromises.map(compromise => {
    const indicators = compromise.indicators.map(indicator => {
      const { indicatorId: id } = indicator;
      return { ...indicator, ...metrics.get(id) };
    });
    const attributes = nameGroups(indicators, d => d.attribute);
    return { ...compromise, indicators, attributes };
  });
  const maxIndicators = max(fullCompromises, d => d.indicators.length);
  const maxAttributes = max(fullCompromises, d => d.attributes.length);
  
  return fullCompromises.map((compromise, i) => {
    return <Compromise
      key={ i }
      max={ maxIndicators }
      maxGroups={ maxAttributes }
      compromise={ compromise }
      number={ i + 1 }
      />
  });
}