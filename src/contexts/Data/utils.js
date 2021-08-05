import { groups, max, min } from 'd3';

export const nameGroups = (data, fun, trans) =>
  groups(data, fun).map((d) => {
    const [name, values] = d;
    return trans({ name, values });
  });

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
      ? value
      : null;
    return { ...item, intended };
  });
  const normalizedValues = intendedValues.map((item) => {
    const { intended } = item;
    const isNumber = typeof intended === 'number';
    const normal = isNumber
      ? diff
        ? ((intended - minValue) * 100) / diff
        : diff
      : null;
    return { ...item, normal };
  });
  const fullValues = normalizedValues.map((item) => {
    return {
      ...item,
      min: minValue,
      max: maxValue,
    };
  });
  return fullValues;
};
