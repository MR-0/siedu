import React, { createContext, useContext, useEffect, useState } from 'react';
import { tsv, groups } from 'd3';
import communesPath from 'data/communes.tsv';

const defaulCityCode = '13001';
const defaults = {
  year: 2019,
  region: null,
  city: null,
  commune: null,
  showCity: true,
};

const years = [
  2018,
  2019
];

export const ConfigContext = createContext();
export const ConfigProvider = ({ children }) => {
  const [config, setConf] = useState(defaults);
  const [communes, setCommunes] = useState([]);
  const setConfig = ({ city, commune, ...conf }) => {
    if (city !== undefined) {
      conf.city = cities.find(d => d.code === city) || null;
    }
    if (commune !== undefined) {
      conf.commune = communes.find(d => d.cut === commune) || null;
    }
    setConf({ ...config, ...conf });
  };
  const regions = groups(communes, d => d.city.region).map(d => {
    const [name, communes] = d;
    return { name, communes };
  });
  const cities = groups(communes, d => d.city.code)
    .filter(([code]) => code)
    .map(([code, communes]) => {
      const name = communes[0].city.name;
      const region = communes[0].city.region;
      return { code, name, region, communes };
    });
  const regionCities = cities.filter(d => d.region === config.region);
  const regionCommunes = communes.filter(d => d.city.region === config.region);

  useEffect(() => {
    tsv(communesPath).then(result => {
      const communes = result.map(d => {
        const { cut, name, region, cityName } = d;
        const city = { name: cityName, code: d.city, region };
        return { cut, name, city };
      });
      setCommunes(communes);
    });
  }, []);

  return (
    <ConfigContext.Provider value={{
      ...config,
      years,
      regions,
      communes,
      regionCities,
      regionCommunes,
      cityCommunes: config.city?.communes || [],
      setConfig
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfigValue = () => useContext(ConfigContext);