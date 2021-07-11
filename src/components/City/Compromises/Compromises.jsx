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
  const { city, cityCommunes } = useConfigValue();
  const [ chunks, setChunks ] = useState([]);

  // return cityCommunes.map((commune, i) => {
  //   return <Commune key={i} commune={commune} />
  // });

  // console.log(city, chunks);

  useEffect(() => {
    console.log('happens');
    setChunks([]);
    return addToChunk(setChunks, cityCommunes.slice(0, 10), []);
  }, [ cityCommunes ]);

  return city && chunks;
};

const Commune = React.memo(({ commune }) => {
  const { compromises } = useDataValue();

  return compromises.map((compromise, i) => {
    return <Compromise key={i} compromise={compromise} commune={commune} />
  });
});