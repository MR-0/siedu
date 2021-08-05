import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTsvIndicators } from './tsvIndicatorsHook';
import { useContents } from './contentsHook';
import { useConfigValue } from 'contexts/Config';
import { groupFeature, getNormalizeValues } from './utils';

const useIndicators = year => {
  const { contents } = useContents(year);
  const { indicators } = useTsvIndicators(year);
  const { indicators:oldIndicators } = useTsvIndicators(year - 1);
  const oldIndicatorsKeys = oldIndicators.reduce((out, indicator) => {
    const { code, commune } = indicator;
    const key = `${ code }_${ commune }`;
    out[key] = indicator;
    return out;
  }, {});
  return indicators.map(indicator => {
    const { code, commune } = indicator;
    const key = `${ code }_${ commune }`;
    const intent = contents.find(cont => cont.indicatorId === code)?.intent;
    const old = oldIndicatorsKeys[key];
    return { ...indicator, intent, old };
  });
};

const createFilterGroup = (groups, city) => {
  return {
    values: groups,
    get: (name) => {
      const group = groups.find((d) => d.name === name);
      const values = (group?.values || []).filter(d => d.city === city?.code);
      return group && { ...group, values };
    },
    getAll: (name) => groups.find((d) => d.name === name),
  }
}

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [ features, setFeatures ] = useState({});
  const { year, city, communes:communesValues } = useConfigValue();
  const { compromises } = useContents(year);
  const indicators = useIndicators(year);

  Object.entries(features).map(([key, feature]) => {
    return features[key] = createFilterGroup(feature, city);
  });

  useEffect(() => {
    const regions = groupFeature(indicators, 'region');
    const metrics = groupFeature(indicators, 'code', (group) => {
      const values = getNormalizeValues(group.values);
      return { ...group, values };
    });
    const communes = groupFeature(indicators, 'commune', group => {
      const { name: code, values } = group;
      const { name } = communesValues?.find(d => d.cut === code) || {};
      return { code, name, values };
    });

    setFeatures({ regions, metrics, communes });
  }, [year]);

  console.log(features);

  return (
    <DataContext.Provider value={{ indicators, compromises, ...features }}>
      { children }
    </DataContext.Provider>
  );
};

export const useDataValue = () => useContext(DataContext);