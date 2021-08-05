import { deviation, groups, max, median, min } from 'd3';

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
    const noNullValues = values.filter((d) => d.normal !== null);
    const minValue = min(noNullValues, (d) => d.normal);
    const maxValue = max(noNullValues, (d) => d.normal);
    const medianValue = median(noNullValues, (d) => d.normal);
    const deviationValue = deviation(noNullValues, (d) => d.normal);
    return {
      ...group,
      min: minValue || null,
      max: maxValue || null,
      median: medianValue || null,
      deviation: deviationValue || null,
    };
  });

  return groups;
};

export const getNormalizeValues = (values) => {
  const noNullValues = values.filter((d) => d.value !== null);
  const minValue = min(noNullValues, (d) => d.value);
  const maxValue = max(noNullValues, (d) => d.value);
  const diff = maxValue - minValue;
  const intendedValues = values.map((item) => {
    const { value, intent } = item;
    const isNegative = intent === 'negative';
    const isNumber = typeof value === 'number';
    const intended = isNegative
      ? isNumber
        ? maxValue - value
        : null
      : isNumber
      ? value - minValue
      : null;
    return { ...item, intended };
  });
  const normalizedValues = intendedValues.map((item) => {
    const { intended } = item;
    const isNumber = typeof intended === 'number';
    const normal = isNumber ? (diff ? (intended * 100) / diff : diff) : null;
    return { ...item, normal };
  });
  const medianValue = median(normalizedValues, (d) => d.normal);
  const deviationValue = deviation(normalizedValues, (d) => d.normal);
  const classificateddValues = normalizedValues.map((item) => {
    const std = item.standard?.value;
    let cls = '';
    if (std) {
      if (item.normal < std - deviationValue) cls = 'high';
      if (item.normal >= std - deviationValue) cls = 'medium';
      if (item.normal >= std - deviationValue * 0.5) cls = 'low';
      if (item.normal >= std) cls = 'zero';
    }
    return { ...item, classification: cls };
  });
  const fullValues = classificateddValues.map((item) => {
    return {
      ...item,
      min: minValue,
      max: maxValue,
      median: medianValue,
      deviation: deviationValue,
    };
  });
  return fullValues;
};
