import { useState, useEffect } from 'react';
import { toUrlString } from 'utils';

const baseUrl = 'https://services5.arcgis.com/hUyD8u3TeZLKPe4T/ArcGIS/rest/services/BBDD_SIEDU_V4_Capa_Consolidada/FeatureServer/';
const baseLayerUrl = baseUrl + '0';
const props = {
  "OBJECTID": null,
  "REGION": "region",
  "NOM_REGION": null,
  "PROVINCIA": null,
  "NOM_PROVINCIA": null,
  "AREA": null,
  "CIUDAD": 'city',
  "NOM_CIUDAD": null,
  "COMUNA": 'commune',
  "NOM_COMUNA": 'communeName',
  "ANO_INDICADOR": 'year',
  "COD_INDICADOR": 'code',
  "NOM_INDICADOR": 'codeName',
  "VALOR_INDICADOR": 'value',
  "Shape__Area": null,
  "Shape__Length": null
};

const getUrlByYear = year => {
  const queryArgs = {
    where: `ANO_INDICADOR=${ year }`,
    outFields: '*',
    returnGeometry: 'false',
    f: 'json'
  };
  const queryUrl = '/query?' + toUrlString(queryArgs, '&');
  return baseLayerUrl + queryUrl;
}

export const useSieduArcgisApi = year => {
  const url = getUrlByYear(year);
  const [ uglyFeature, setUglyFeatures ] = useState([]);
  const features = uglyFeature.map(feature => {
    const out = {};
    Object.keys(props).map(k => {
      const key = props[k];
      if (key) out[key] = feature[k];
    });
    return out;
  });

  useEffect(() => {
    (async () => {
      const response = await fetch(url);
      const result = await response.json();
      const features = result.features.map(feature => feature.attributes);
      setUglyFeatures(features);
    })();
  }, [year]);

  return { features };
};