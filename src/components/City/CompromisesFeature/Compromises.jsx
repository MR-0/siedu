import React from 'react';
import { max, groups } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

export const Compromises = () => {
  const { compromises, metrics } = useDataValue();
  const fullCompromises = compromises.map(d => {
    const out = {
      ...d,
      indicators: addIndicatorsValues(d.indicators, metrics)
    };

    out.attributes = groups(out.indicators, d => d.attribute).map(d => {
      const [ name, values ] = d;
      return { name, values };
    });

    return out;
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

const addIndicatorsValues = (indicators, metrics) => {
  return indicators.map(d => {
    const { values, median, deviation } = metrics.get(d.indicatorId);
    return { ...d, values, median, deviation };
  });
};