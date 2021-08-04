import React, { Fragment, useState } from 'react';
import { max, groups, median } from 'd3';
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

export const Compromises = () => {
  const { compromises, metrics } = useDataValue();
  const [ tooltip, setTooltip ] = useState(null);
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
  const handleShowTooltip = (event, data) => {
    if (!event) setTooltip(null);
    else {
      event.stopPropagation();
      const { clientX:x, clientY:y } = event;
      setTooltip({ ...data, x, y });
    }
  }
  return (
    <Fragment>
      {fullCompromises.map((compromise, i) => {
        return <Compromise
          key={ i }
          max={ maxIndicators }
          maxGroups={ maxAttributes }
          compromise={ compromise }
          showTooltip={ handleShowTooltip }
          number={ i + 1 }
          />
      })}
      { tooltip && (
        <div className="tooltip" style={{
          left:tooltip.x,
          top:tooltip.y, 
        }}>
          <p>{ tooltip.indicatorId }</p>
          <p>
            <b>{ tooltip.values && median(tooltip.values, d => d.value )}</b>
          </p>
        </div>
      ) }
    </Fragment>
  )
}

const addIndicatorsValues = (indicators, metrics) => {
  return indicators.map(d => {
    const { values, median, deviation } = metrics.get(d.indicatorId);
    return { ...d, values, median, deviation };
  });
};