import React, { Fragment } from 'react';
import { mean, max, median, min } from 'd3';
import { Header } from '../common/Header';
import { Legend } from '../common/Legend';
import { Compromise } from './Compromise';
import { useDataValue } from 'contexts/Data';

export const Breachs = () => {
  const { metrics, compromises } = useDataValue();
  const worst = compromises
    .map(compromise => {
      const indicators = compromise.indicators
        .map( indicator => {
          const { indicatorId:id } = indicator;
          const { values } = metrics.get(id);
          const { value, normal, intended, ...rest } = values[0];
          const medianValue = median(values, d => d.normal);
          return { ...indicator, ...rest, values, cityMedian: medianValue };
        });
      const medianValue = median(indicators, d => d.cityMedian);
      return { ...compromise, indicators, median: medianValue };
    })
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