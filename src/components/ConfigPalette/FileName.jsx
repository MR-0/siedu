import React, { useEffect, useState } from 'react';
import { styles as els } from 'elementary';
import { useConfigValue } from 'contexts/Config';

export const FileName = ({ year, onChange }) => {
  const { city, commune, showCity } = useConfigValue();
  const [fileName, setFileName] = useState('SinNombre');
  const prefix = showCity ? 'Ciudad' : 'Comuna';
  const place = showCity
    ? city?.name || 'SinCiudad'
    : commune?.name || 'SinComuna'
  const endName = `SIEDU_${prefix}_${place}_${fileName}_${year}_`;
  const handleFileNameChange = e => {
    e.preventDefault();
    setFileName(e.target.value);
  };

  useEffect(() => {
    onChange(endName);
  }, [fileName]);
  
  return (
    <div>
      <label>
        <p>Nombre de archivos</p>
        <input
          type="text"
          value={fileName}
          onChange={handleFileNameChange}
        />
      </label>
      <br />
      <p className={els.marXs}>
        <span className={els.textSm}>Previsualización del nombre</span>
      </p>
      <p style={{
        opacity: 0.8,
        wordWrap: 'break-word'
      }}>{endName}000</p>
    </div>
  )
}