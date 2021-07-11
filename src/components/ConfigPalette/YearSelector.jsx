import React, { useState } from 'react';
import { Select } from './Select';
import { useConfigValue } from 'contexts/Config';

export const YearSelector = ({ onChange }) => {
  const { year: parentYear, years } = useConfigValue();
  const [year, setYear] = useState(parentYear);
  const handleChangeYear = year => {
    onChange({ year: year * 1 });
    setYear(year * 1);
  };
  return (
    <Select
      label="Período"
      value={year}
      values={years}
      onChange={handleChangeYear}
    >
      <option value="">Selecciona medición</option>
    </Select>
  )
};