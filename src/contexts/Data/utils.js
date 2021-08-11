import { deviation, groups, max, median, min } from 'd3';

export const nameGroups = (data, fun, trans) =>
  groups(data, fun).map((d) => {
    const [name, values] = d;
    const group = { name, values };
    return trans ? trans(group) : group;
  });

export const groupFeature = (data, key, transform) => {
  const incompleteGroups = nameGroups(data, (d) => d[key], transform);
  // TODO: Esto no sirve para nada
  const groups = incompleteGroups.map((group) => {
    const { values } = group;
    const props = getGroupProps(values[0]);
    const oldProps = getGroupProps(values[0].old);
    const oldValues = values.map((d) => d.old);

    return {
      ...group,
      ...props,
      old: {
        ...oldProps,
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

  const normalizedValues = intendedValues.map((item, i) => {
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
  const normalDeviationValue = deviation(
    notNullNormalizedValues,
    (d) => d.normal
  );

  const classificateddValues = normalizedValues.map((item) => {
    const std = item.standard?.value;
    let cls = '';
    if (std) {
      if (item.normal < std - normalDeviationValue) cls = 'high';
      if (item.normal >= std - normalDeviationValue) cls = 'medium';
      if (item.normal >= std - normalDeviationValue * 0.5) cls = 'low';
      if (item.normal >= std) cls = 'zero';
    } else {
      if (item.normal < difValue * 0.25) cls = 'high';
      if (item.normal >= difValue * 0.25) cls = 'medium';
      if (item.normal >= difValue * 0.5) cls = 'low';
      if (item.normal >= difValue * 0.75) cls = 'zero';
    }
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

const getGroupProps = (item) => {
  const {
    classification,
    intended,
    intent,
    normal,
    old,
    original,
    value,
    ...rest
  } = item;
  return { ...rest };
};
