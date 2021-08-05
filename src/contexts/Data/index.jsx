import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTsvIndicators } from './tsvIndicatorsHook';
import { useContents } from './contentsHook';
import { useConfigValue } from 'contexts/Config';
import { groupFeature, getNormalizeValues } from './utils';

const useIndicators = year => {
  const { contents } = useContents(year);
  const { indicators } = useTsvIndicators(year);
  const { indicators:oldIndicators } = useTsvIndicators(year - 1);
  return indicators.map(indicator => {
    const intent = contents.find(cont => cont.indicatorId === d.code)?.intent;
    const old = oldIndicators.find(({ code:oldCode, commune:oldCommune }) => {
      const { code, commune } = indicator;
      return oldCode === code && oldCommune === commune;
    })
    return { ...indicator, intent, old };
  });
};

const createFilterGroups = (values, city) => {
  return {
    values,
    get: (name) => values.find((d) => d.name === name),
    getAll: (name) => values.find((d) => d.name === name),
  }
}

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [ groups, setGroups ] = useState({});
  const { year, city, communes:communesValues } = useConfigValue();
  const { compromises } = useContents(year);
  const indicators = useIndicators(year);
  const filterGroups = createFilterGroups(groups, city);

  useEffect(() => {
    const regions = groupFeature(indicators, 'region', city);
    const metrics = groupFeature(indicators, 'code', city, (group) => {
      const values = getNormalizeValues(group.values);
      return { ...group, values };
    });
    const communes = groupFeature(indicators, 'commune', city, group => {
      const { name: code, values } = group;
      const { name } = communesValues?.find(d => d.cut === code) || {};
      return { code, name, values };
    });

    setGroups({ regions, metrics, communes });
  }, [year]);

  return (
    <DataContext.Provider value={{ indicators, compromises, ...filterGroups }}>
      { children }
    </DataContext.Provider>
  );
};

export const useDataValue = () => useContext(DataContext);