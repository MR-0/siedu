import { useState, useEffect } from 'react';
import { tsv, tsvParse } from 'd3';

import communesPath from 'data/communes.tsv';

export const useTsvIndicators = (year) => {
  const url = `./data/indicators_${year}.tsv`;
  const [communes, setCommunes] = useState([]);
  const [uglyFeatures, setUglyFeatures] = useState([]);
  const features = uglyFeatures
    .reduce((out, row, i) => {
      const { cut: commune } = row;
      Object.keys(row).map((code) => {
        const place = communes.find((d) => d.cut === commune);
        let value = row[code];
        // -------------------------
        value = value !== '' ? value : null;
        value = value !== 'S/I' ? value : null;
        value = value !== 'S/R' ? value : null;
        value = value !== 'N/A' ? value : null;
        value = value !== 'Comuna no costera' ? value : null;
        value = value !== 'Sin CITSU' ? value : null;
        value = value !== 'Sin Zona de Afectación' ? value : null;
        value = value !== 'S/ZCH' ? value : null;
        value = value !== 'Sin ZT' ? value : null;
        // -------------------------
        value = value !== 'SI' ? value : 1;
        value = value !== 'NO' ? value : 0;
        // -------------------------
        value = value !== null ? value * 1 : null;
        // -------------------------
        if (!value && value !== 0) {
          // show undefined values
          // console.log(code, '\t' + i, ' -> \t', row[code], value);
        }
        if (code !== 'cut') {
          out.push({
            code,
            commune,
            communeName: place?.name,
            city: place?.city,
            region: place?.region,
            value,
            year,
          });
        }
      });
      return out;
    }, [])
    .filter((d) => d.commune !== undefined);

  useEffect(() => {
    (async () => {
      const communes = await tsv(communesPath);
      try {
        const response = await fetch(url);
        const result = await response.text();
        const features = tsvParse(result);
        setCommunes(communes);
        setUglyFeatures(features);
      } catch (err) {}
    })();
  }, [year]);

  return { indicators: features };
};
