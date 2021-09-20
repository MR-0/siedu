import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import style from './PrintingModal.module.scss';

export const PrintingModal = ({ visible }) => {
  const [showStyle, setSwhoStyle] = useState('');
  
  useEffect(() => {
    setSwhoStyle(visible ? style.show : '');
  }, [visible]);
  
  return visible ? (
    <div className={clsx(style.modal, showStyle)}>
      <p>Imprimiendo...</p>
    </div>
  ) : null;
}