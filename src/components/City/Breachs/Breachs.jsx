import React from 'react';
import { mean, max, median } from 'd3';
import { Header } from '../common/Header';
import { Compromise } from './Compromise';
import { useDataValue } from 'contexts/Data';

// TODO: Pensando que vamos a cortar

export const Breachs = () => {
  const { metrics, compromises } = useDataValue();
  const worst = compromises
    .map(compromise => {
      const indicators = compromise.indicators
        .map( indicator => {
          const { indicatorId } = indicator;
          const { values:allValues } = metrics.get(indicatorId);
          const { values:allNationalValues } = metrics.getAll(indicatorId);
          const values = allValues?.filter(d => d.value !== null) || [];
          const nationalValues = allNationalValues?.filter(d => d.value !== null) || [];
          const medianValue = median(values, d => d.intentded);
          const nationalMax = max(nationalValues, d => d.intentded)
          const nationalMedian = median(nationalValues, d => d.intentded);
          return { ...indicator, values, median: medianValue, nationalMedian, nationalMax }
        })
        .filter(d => d.median || d.median === 0);
      const medianValue = median(indicators, d => d.median);
      return { ...compromise, indicators, median: medianValue };
    })
    // .filter(d => d.median)
    // --> menor es peor
    .sort((a,b) => a.median > b.median ? 1 : a.median < b.median ? -1 : 0)
    // --> los tres peores
    // .slice(0,3);
  return (
    <section className="breaches">
      <Header subtitle="Principales brechas" />
      { worst.map((d, i) => <Compromise key={i} data={d} /> ) }
    </section>
  )
};