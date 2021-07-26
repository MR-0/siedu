import React from 'react';
import { useConfigValue } from 'contexts/Config';
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

export const Compromises = () => {
  const { commune } = useConfigValue();
  
  return <Commune commune={commune} />
};

const Commune = React.memo(({ commune }) => {
  const { compromises } = useDataValue();

  return compromises.map((compromise, i) => {
    return <Compromise key={i} compromise={compromise} commune={commune} />
  });
});