import React, { createContext, useContext } from 'react';
import { groups, mean, median, deviation, max, min } from 'd3';
import { useTsvIndicators } from './tsvIndicatorsHook';
import { useContents } from './contentsHook';
import { useConfigValue } from 'contexts/Config';
import { getNormalizeValues } from './utils';

const nameGroups = (data, fun, trans) => groups(data, fun).map(d => {
  const [ name, values ] = d;
  return trans({ name, values });
});

const getGroup = group => {
  return name => {
    const values = group.find(d => d.name === name)?.values || [];
    const noNullValues = values.filter(d => d.normal !== null);
    const valuesMin = min(noNullValues, d => d.normal);
    const valuesMax = max(noNullValues, d => d.normal);
    const valuesMean = mean(noNullValues, d => d.normal);
    const valuesMedian = median(noNullValues, d => d.normal);
    const valuesDeviation = deviation(noNullValues, d => d.normal)
    return {
      values,
      min: valuesMin || null,
      max: valuesMax || null,
      mean: valuesMean || null,
      median: valuesMedian || null,
      deviation: valuesDeviation || null
    };
  };
};

const groupFeature = (data, key, cityObj, transform) => {
  transform = transform || (d => d);
  const city = cityObj?.code;
  const values = nameGroups(data, d => d[key], transform);
  const localData = data.filter(d => d.city === city);
  const localValues = nameGroups(localData, d => d[key], transform);
  return {
    values,
    localValues,
    get: getGroup(localValues),
    getAll: getGroup(values), 
  };
};

const useIndicatorsWithIntent = year => {
  const { contents } = useContents(year);
  const { indicators } = useTsvIndicators(year);
  return indicators.map(d => {
    d.intent = contents.find(cont => cont.indicatorId === d.code)?.intent;
    return d;
  });
};

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const { year, city, communes:communesValues } = useConfigValue();
  const { compromises } = useContents(year);
  const indicators = useIndicatorsWithIntent(year);
  const oldIndicators = useIndicatorsWithIntent(year - 1);
  
  const regions = groupFeature(indicators, 'region', city);
  const metrics = groupFeature(indicators, 'code', city, (group) => {
    const values = getNormalizeValues(group.values);
    return { ...group, values };
  });
  const oldMetrics = groupFeature(oldIndicators, 'code', city, (group) => {
    const values = getNormalizeValues(group.values);
    return { ...group, values };
  });
  const communes = groupFeature(indicators, 'commune', city, group => {
    const { name: code, values } = group;
    const { name } = communesValues?.find(d => d.cut === code) || {};
    return { code, name, values };
  });

  const oldIndicatorsObj = oldIndicators.reduce((out, d) => {
    const key = d.code + '_' + d.commune;
    out[key] = { ...d };
    return out;
  }, {});

  indicators.map(d => {
    const key = d.code + '_' + d.commune;
    d.old = oldIndicatorsObj[key] || null;
  });

  return (
    <DataContext.Provider value={{ indicators, compromises, metrics, regions, communes }}>
      { children }
    </DataContext.Provider>
  );
};

export const useDataValue = () => useContext(DataContext);