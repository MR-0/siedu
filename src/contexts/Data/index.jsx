import React, { createContext, useContext, useEffect, useState } from 'react';
import { groups, mean, median, deviation, max, min } from 'd3';
import { useTsvIndicators } from './tsvIndicatorsHook';
import { useSieduArcgisApi } from './arcgisHhook';
import { useContents } from './contentsHook';
import { useConfigValue } from 'contexts/Config';

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

const getFeature = (data, key, cityObj, transform) => {
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

const normalizeByGroup = group => {
  const { values } = group;
  const noNullValues = values.filter(d => d.value !== null);
  const valuesDeviation = deviation(noNullValues, d => d.value);
  values.map(d => {
    if (d.value !== null) {
      if (valuesDeviation === undefined) d.normal = null;
      else d.normal = valuesDeviation && d.value / valuesDeviation;
    }
    else {
      d.normal = null;
    }
  });
  const valuesMax = max(values, d => d.normal);
  const valuesAbsMax = max(values, d => d.value);
  values.map(d => {
    const isNegative = d.intent === 'negative';
    const intended = valuesMax
      ? valuesMax - d.normal
      : d.normal;
    d.intentded = isNegative
      ? intended
      : d.normal;
    d.standard.value = isNegative
      ? valuesAbsMax - d.standard.value
      : d.standard.value;
  });
  return group;
}

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
  
  // const { features: otherFeatures } = useSieduArcgisApi(year);
  const regions = getFeature(indicators, 'region', city);
  const metrics = getFeature(indicators, 'code', city, normalizeByGroup);
  const oldMetrics = getFeature(oldIndicators, 'code', city, normalizeByGroup);
  const communes = getFeature(indicators, 'commune', city, group => {
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

const capitalize = (str) => {
  return str.split(' ').map(d => {
    return ''
      + d.slice(0,1).toUpperCase()
      + d.slice(1).toLowerCase()
  }).join(' ')
};

const logAllCommunes = (uglyFeatures, communes) => {
  const featureCommunes = groups(uglyFeatures, d => d.COMUNA);
  const fullCommunes = communes.map(d => {
    const feature = featureCommunes.find(fd => fd[0] === d.cut);
    const city = feature ? feature[1][0].CIUDAD : '';
    const cityName = feature ? capitalize(feature[1][0].NOM_CIUDAD) : '';
    return [d.cut, d.name, d.region, city, cityName];
  });

  console.log(fullCommunes);
  window.fullCommunes = [
    ['cut','name','region','city','cityName'],
    ...fullCommunes
  ].map(d => d.join('\t')).join('\n');
};