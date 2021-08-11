import { useState, useEffect } from 'react';
import { tsv, groups } from 'd3';

import indicatorsMetaPath from 'data/indicators-meta.tsv';
import compromisesFile from 'data/compromises.tsv';

export const useContents = (year) => {
  const [indicators, setIndicators] = useState(null);
  const [compromisesContent, setCompromisesContent] = useState(null);
  const years = indicators
    ? groups(indicators, (d) => d.year * 1).map((d) => {
        const [year, values] = d;
        return { year, values };
      })
    : [];
  const contents = years.find((d) => d.year === year * 1)?.values || [];
  const compromises = groups(contents, (d) => d.compromiseSlug).map((d) => {
    const [key, indicators] = d;
    const content = compromisesContent.find((d) => d.slug === key);
    return { key, indicators, ...content };
  });

  useEffect(() => {
    Promise.all([tsv(indicatorsMetaPath), tsv(compromisesFile)]).then(
      (results) => {
        setCompromisesContent(results[1]);
        setIndicators(results[0]);
      }
    );
  }, []);

  return { contents, compromises };
};
