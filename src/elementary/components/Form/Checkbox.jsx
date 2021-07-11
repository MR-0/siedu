import React, { useState } from 'react';
import { useFormValues } from './FormContext';
import { cls } from '../utils';

import style from './Checkbox.scss';

export const Checkbox = ({ children, className, ...attrs }) => {
  const [ valid, setValid ] = useState(true);
  const { validate } = useFormValues();
  const selectors = cls(style.checkbox, className, !valid && style.wrong);
  const handleChange = e => setValid(validate(e.target));
  return (
    <label className={ selectors }>
      <input
        { ...attrs }
        type="checkbox"
        onBlur={ handleChange }
        onChange={ handleChange }
        className={ style.input }
        />
      <p className={ style.label }>{ children }</p>
    </label>
  );
};