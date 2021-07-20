import React, { useEffect, useState } from 'react';
import { useConfigValue } from 'contexts/Config';
import { useDataValue } from 'contexts/Data';
import { Compromise } from './Compromise';

const addToChunk = (setter, arr, chunk) => {
  const i = chunk.length;
  const commune = arr[i];

  if (commune) {
    chunk = [ ...chunk, <Commune key={i} commune={commune} /> ];
    setter && setter(chunk);
    window.requestAnimationFrame(() => {
      addToChunk(setter, arr, chunk)
    });
  }

  return () => {
    arr = [];
    chunk = [];
    setter = null;
  }
};

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