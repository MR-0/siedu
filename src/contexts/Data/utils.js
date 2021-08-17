import { deviation, groups, max, median, min, quantile } from 'd3';

export const nameGroups = (data, fun, trans) =>
  groups(data, fun).map((d) => {
    const [name, values] = d;
    const group = { name, values };
    return trans ? trans(group) : group;
  });

export const groupFeature = (data, key, transform) => {
  const incompleteGroups = nameGroups(data, (d) => d[key], transform);
  const groups = incompleteGroups.map((group) => {
    const { values } = group;
    const oldValues = values.map((d) => d.old);
    const props = getProps(values);
    const oldProps = getProps(oldValues);
    const itemProps = getItemProps(values[0]);
    const oldItemProps = getItemProps(values[0].old);

    return {
      ...group,
      ...props,
      ...itemProps,
      old: {
        ...oldProps,
        ...oldItemProps,
        values: oldValues,
      },
    };

    // const noNullValues = values.filter((d) => d.normal !== null);
    // const minValue = min(noNullValues, (d) => d.normal);
    // const maxValue = max(noNullValues, (d) => d.normal);
    // const medianValue = median(noNullValues, (d) => d.normal);
    // const deviationValue = deviation(noNullValues, (d) => d.normal);
    // return {
    //   ...group,
    //   min: minValue,
    //   max: maxValue,
    //   dif: maxValue - minValue,
    //   median: medianValue,
    //   deviation: deviationValue,
    //   standard: values[0].standard,
    // };
  });

  return groups;
};

export const normalize = (values) => {
  const oldValues = values.map((d) => d.old || {});
  const fullOldValues = getFullValues(oldValues);
  const fullValues = getFullValues(values).map((item, i) => {
    const old = fullOldValues[i];
    return { ...item, old };
  });

  return fullValues;
};

const getFullValues = (values) => {
  const noNullValues = values.filter((d) => d.value !== null);
  const minValue = min(noNullValues, (d) => d.value);
  const maxValue = max(noNullValues, (d) => d.value);
  const medianValue = median(values, (d) => d.value);
  const deviationValue = deviation(noNullValues, (d) => d.value);
  const difValue = maxValue - minValue;

  const intendedValues = values.map((item) => {
    const { value, intent } = item;
    const isNegative = intent === 'negative';
    const isNumber = typeof value === 'number' && !isNaN(value);
    let intended = null;
    if (isNumber) {
      if (isNegative) intended = maxValue - value;
      else intended = value;
    }
    return { ...item, intended };
  });

  const normalizedValues = intendedValues.map((item) => {
    const { intent, intended } = item;
    const isNegative = intent === 'negative';
    const value = isNegative ? intended : intended - minValue;
    const isNumber = typeof intended === 'number';
    const normal = isNumber
      ? difValue
        ? (value * 100) / difValue
        : difValue
      : null;

    return { ...item, normal };
  });

  const notNullNormalizedValues = normalizedValues.filter(
    (d) => d.normal !== null
  );

  const normalMinValue = min(notNullNormalizedValues, (d) => d.normal);
  const normalMaxValue = max(notNullNormalizedValues, (d) => d.normal);
  const normalMedianValue = median(normalizedValues, (d) => d.normal);
  const normalQuantile25Value = quantile(
    normalizedValues,
    0.25,
    (d) => d.normal
  );
  const normalQuantile50Value = quantile(
    normalizedValues,
    0.5,
    (d) => d.normal
  );
  const normalQuantile75Value = quantile(
    normalizedValues,
    0.75,
    (d) => d.normal
  );
  const normalDeviationValue = deviation(
    notNullNormalizedValues,
    (d) => d.normal
  );

  const classificateddValues = normalizedValues.map((item) => {
    const { intent, standard } = item;
    const hasStd = standard?.value !== undefined && standard?.value !== null;
    const isNegative = intent === 'negative';
    const stdNorm = hasStd
      ? isNegative
        ? ((maxValue - standard.value) * 100) / difValue
        : ((standard.value - minValue) * 100) / difValue
      : null;
    let cls = 'undefined';
    if (item.value !== null) {
      if (stdNorm) {
        if (item.normal < stdNorm - normalDeviationValue) cls = 'high';
        if (item.normal >= stdNorm - normalDeviationValue) cls = 'medium';
        if (item.normal >= stdNorm - normalDeviationValue * 0.5) cls = 'low';
        if (item.normal >= stdNorm) cls = 'zero';
      } else {
        if (intent === 'boolean') {
          if (item.value < 1) cls = 'high';
          else cls = 'zero';
        } else {
          if (item.normal < normalQuantile25Value) cls = 'high';
          if (item.normal >= normalQuantile25Value) cls = 'medium';
          if (item.normal >= normalQuantile50Value) cls = 'low';
          if (item.normal >= normalQuantile75Value) cls = 'zero';
        }
      }
    }
    if (standard) standard.normal = stdNorm;
    return { ...item, classification: cls };
  });

  return classificateddValues.map((item) => {
    return {
      ...item,
      min: minValue,
      max: maxValue,
      median: medianValue,
      deviation: deviationValue,
      normalMin: normalMinValue,
      normalMax: normalMaxValue,
      normalMedian: normalMedianValue,
      normalDeviation: normalDeviationValue,
    };
  });
};

const getItemProps = (item) => {
  const { city, code, commune, communeName, region, standard } = item;
  return { city, code, commune, communeName, region, standard };
};

const getProps = (values) => {
  const notNullValues = values.filter((d) => d.value !== null);
  const minValue = min(notNullValues, (d) => d.value);
  const maxValue = max(notNullValues, (d) => d.value);
  const medianValue = median(values, (d) => d.value);
  const deviationValue = deviation(values, (d) => d.value);
  const normalMinValue = min(notNullValues, (d) => d.normal);
  const normalMaxValue = max(notNullValues, (d) => d.normal);
  const normalMedianValue = median(values, (d) => d.normal);
  const normalDeviationValue = deviation(values, (d) => d.normal);
  return {
    min: minValue,
    max: maxValue,
    median: medianValue,
    deviation: deviationValue,
    normalMin: normalMinValue,
    normalMax: normalMaxValue,
    normalMedian: normalMedianValue,
    normalDeviation: normalDeviationValue,
  };
};
