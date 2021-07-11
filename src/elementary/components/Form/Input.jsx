import React, { useState } from 'react';
import { useFormValues } from './FormContext';
import { cls } from '../utils';

import styles from './Input.scss';

export const Input = ({ children, className: parentClassName, ...attrs }) => {
  const [ valid, setValid ] = useState(true);
  const { validate } = useFormValues();
  const { holder, label, input, wrong } = styles;
  const className = cls(holder, parentClassName, !valid && wrong);
  const handleBlur = e => setValid(validate(e.target));
  const handleFocus = () => setValid(true);
  
  attrs.type = attrs.type || 'text';
  
  return (
    <label className={ className }>
      <p className={ label }>{ children }</p>
      <input
        { ...attrs }
        onBlur={ handleBlur }
        onFocus={ handleFocus }
        className={ input }
        />
    </label>
  )
};