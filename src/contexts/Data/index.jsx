import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTsvIndicators } from './tsvIndicatorsHook';
import { useContents } from './contentsHook';
import { useConfigValue } from 'contexts/Config';
import { nameGroups, groupFeature, normalize } from './utils';

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
  const localValues = groups
    .map((group) => {
      const values = group.values.filter(d => d.city === city?.code);
      return { ...group, values }
    })
    .filter((group) => group.values.length)
  return {
    values: groups,
    localValues,
    get: (name) => {
      const group = groups.find((d) => d.name === name) || {};
      const values = (group.values || []).filter(d => d.city === city?.code);
      return group && { ...group, values };
    },
    getAll: (name) => groups.find((d) => d.name === name) || { values: [] },
  }
}

export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const { year, city, communes:communesValues } = useConfigValue();
  const { compromises } = useContents(year);
  const indicators = useIndicators(year);
  const normalizedIndicators = nameGroups(
    indicators,
    (d) => d.code,
    ({ values }) => normalize(values)
  ).reduce((a, b) => a.concat(b), []);

  const regions = groupFeature(normalizedIndicators, 'region');
  const metrics = groupFeature(normalizedIndicators, 'code');
  const communes = groupFeature(normalizedIndicators, 'commune', (group) => {
    const { name: code, values } = group;
    const { name } = communesValues?.find(d => d.cut === code) || {};
    return { code, name, values };
  });
  const features = {
    regions: createFilterGroup(regions, city),
    metrics: createFilterGroup(metrics, city),
    communes: createFilterGroup(communes, city),
  };

  return (
    <DataContext.Provider value={{
      indicators: normalizedIndicators,
      compromises,
      ...features
    }}>
      { children }
    </DataContext.Provider>
  );
};

export const useDataValue = () => useContext(DataContext);