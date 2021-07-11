import React, { useState } from 'react';
import clsx from 'clsx';
import style from './Switch.module.scss';

const noDefault = fun => {
  return e => {
    e.preventDefault();
    fun(e);
  };
}

export const Switch = ({ first, second, onChange }) => {
  const [value, setValue] = useState(first);
  const isFirst = value === first;
  const place = isFirst ? style.first : style.second;
  const changeTo = value => {
    onChange(value);
    setValue(value);
  };
  const handleFisrtClick = noDefault(() => changeTo(first));
  const handleToggleClick = noDefault(() => changeTo(isFirst ? second : first));
  const handleSecondClick = noDefault(() => changeTo(second));
  return (
    <div className={clsx(style.switch, place)}>
      <a
        href={'#switch-label-' + first}
        className={clsx(style.label, isFirst && style.selected)}
        onClick={handleFisrtClick}
      >{first}</a>
      <a
        href="#switch-toggle"
        className={style.toggle}
        onClick={handleToggleClick
        }>&nbsp;</a>
      <a
        href={'#switch-label-' + second}
        className={clsx(style.label, !isFirst && style.selected)}
        onClick={handleSecondClick}
      >{second}</a>
    </div>
  );
}