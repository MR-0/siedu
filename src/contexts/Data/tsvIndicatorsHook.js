import { useState, useEffect } from 'react';
import { tsv, tsvParse } from 'd3';

import communesPath from 'data/communes.tsv';
import standarsPath from 'data/standars.tsv';

export const useTsvIndicators = (year) => {
  const url = `./data/indicators_${year}.tsv?t=${Date.now()}`;
  const [communes, setCommunes] = useState([]);
  const [standars, setStandars] = useState([]);
  const [uglyIndicators, setUglyIndicators] = useState([]);

  const indicators = uglyIndicators
    .reduce((out, row, i) => {
      const { cut: commune } = row;
      Object.keys(row).map((code) => {
        const place = communes.find((d) => d.cut === commune);
        const original = row[code];
        let value = original;
        // -------------------------
        value = value !== '' ? value : null;
        value = value !== 'S/I' ? value : null;
        value = value !== 'S/R' ? value : null;
        value = value !== 'N/A' ? value : null;
        value = value !== 'Comuna no costera' ? value : null;
        value = value !== 'Sin CITSU' ? value : null;
        value = value !== 'S/ZCH' ? value : null;
        value = value !== 'Sin ZT' ? value : null;
        // -------------------------
        value = value !== 'SI' ? value : 1;
        value = value !== 'NO' ? value : 0;
        value = value !== 'Sin Zona de Afectación' ? value : 0;
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
            original,
            value,
            year,
          });
        }
      });
      return out;
    }, [])
    .map((d) => {
      const standard = standars.find((dd) => dd.indicatorId === d.code);
      return { ...d, standard };
    });

  useEffect(() => {
    (async () => {
      const communes = await tsv(communesPath);
      const uglyStandars = await tsv(standarsPath);
      const standars = uglyStandars.map((d) => {
        const value = d.amount !== '' ? d.amount * 1 : null;
        const max = d.max !== '' ? d.max * 1 : null;
        const min = d.min !== '' ? d.min * 1 : null;
        return { ...d, value, max, min };
      });
      try {
        const response = await fetch(url);
        const result = await response.text();
        const indicators = tsvParse(result);
        setCommunes(communes);
        setStandars(standars);
        setUglyIndicators(indicators);
      } catch (err) {}
    })();
  }, [year]);

  return { indicators };
};
