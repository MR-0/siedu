import React, { Fragment, useState } from 'react';
import { max, median } from 'd3';
import { nameGroups } from '../../../contexts/Data/utils'
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

export const Compromises = () => {
  const { compromises, metrics } = useDataValue();
  const [ tooltip, setTooltip ] = useState(null);
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
  const handleShowTooltip = (event, data) => {
    if (!event) setTooltip(null);
    else {
      event.stopPropagation();
      const { clientX:x, clientY:y } = event;
      setTooltip({ ...data, x, y });
      console.log(data);
    }
  };
  
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