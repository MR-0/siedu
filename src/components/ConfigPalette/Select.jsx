import React, { useState } from 'react';

export const Select = ({ label, value, values, onChange, children, setValues }) => {
  setValues = setValues || (d => [d, d]);
  const [current, setCurrent] = useState('');
  const handleChange = e => {
    e.preventDefault();
    setCurrent(e.target.value);
    onChange && onChange(e.target.value);
  };
  return (
    <label>
      {label && <p>{label}</p>}
      <select
        value={value || current}
        onChange={handleChange}
      >
        {children}
        <optgroup>
          {
            (values || []).map((d, i) => {
              const [value, name] = setValues(d);
              return (
                <option
                  key={i}
                  value={value}
                >{name}</option>
              );
            })
          }
        </optgroup>
      </select>
    </label>
  )
}