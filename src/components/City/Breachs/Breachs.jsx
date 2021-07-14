import React, { Fragment } from 'react';
import { mean, max, median, min } from 'd3';
import { Header } from '../common/Header';
import { Legend } from '../common/Legend';
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
          const nationalAbsMin = min(nationalValues, d => d.value);
          const nationalMax = max(nationalValues, d => d.intentded);
          const nationalAbsMax = max(nationalValues, d => d.value);
          const nationalMedian = median(nationalValues, d => d.intentded);
          return { ...indicator, values, median: medianValue, nationalMedian, nationalMax, nationalAbsMax, nationalAbsMin }
        })
        .filter(d => d.median || d.median === 0);
      const medianValue = median(indicators, d => d.median);
      return { ...compromise, indicators, median: medianValue };
    })
    // .filter(d => d.median)
    // --> menor es peor
    .sort((a,b) => a.median > b.median ? 1 : a.median < b.median ? -1 : 0);
  const worstChunks = chunks(worst, 2);

  return (
    <div className="breaches section">
      { worstChunks.map((worst, i) => (
        <section key={i} className="no-line">
          {!i && (
            <Fragment>
              <Header />
              <Legend
                title="Principales brechas"
                hidden
              />
              <br />
            </Fragment>
          )}
          { worst.map((d) => <Compromise key={d.key} data={d} /> ) }
        </section>
      ))}
    </div>
  )
};

const chunks = (arr, size, out = []) => {
  const part = arr.slice(size);
  out.push(arr.slice(0, size))
  if (part.length) chunks(part, size, out);
  return out;
}