import React, { useState } from 'react';
import { Select } from './Select';
import { Switch } from './Switch';
import { useConfigValue } from 'contexts/Config';

export const ZoneSelector = ({ onChange }) => {
  const { city: parentCity, commune: parentCommune, region, regions, regionCities, regionCommunes, setConfig } = useConfigValue();
  const [type, setType] = useState('Ciudad');
  const [city, setCity] = useState(parentCity);
  const [commune, setCommune] = useState(parentCommune);
  const handleChangeRegion = region => {
    onChange({ region, city: null, commune: null });
    setConfig({ region, city: null, commune: null });
  };
  const handleChangeCity = city => {
    setCity({ code: city });
    onChange({ city });
  };
  const handleChangeCommune = commune => {
    setCommune({ cut: commune });
    onChange({ commune });
  };
  const handleChangeType = type => {
    setType(type);
    onChange({ showCity: type === 'Ciudad' });
    setConfig({ region, city: null, commune: null });
  }
  const isCity = type === 'Ciudad';
  const isCommune = type === 'Comuna';

  return (
    <div>
      <Switch first="Ciudad" second="Comuna" onChange={handleChangeType} />
      <Select
        value=""
        values={regions}
        onChange={handleChangeRegion}
        setValues={d => [d.code, d.name]}
      >
        <option value="">Selecciona región</option>
      </Select>
      {isCity && (
        <Select
          value={city?.code || ''}
          values={regionCities}
          onChange={handleChangeCity}
          setValues={d => [d.code, d.name]}
        >
          <option value="">Selecciona ciudad</option>
        </Select>
      )}
      {isCommune && (
        <Select
          value={commune?.cut || ''}
          values={regionCommunes}
          onChange={handleChangeCommune}
          setValues={d => [d.cut, d.name]}
        >
          <option value="">Selecciona comuna</option>
        </Select>
      )}
    </div>
  )
}