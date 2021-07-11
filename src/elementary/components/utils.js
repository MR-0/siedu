export const formatValidate = d => {
  if (typeof d === 'boolean') return () => d;
  if (typeof d === 'function') return (value) => d(value);
  if (typeof d === 'string') return () => d.toLowerCase() === 'true';
  return () => true;
};

export function cls () {
  const arr = Array.prototype.slice.call(arguments, 0);
  return flat(arr)
    .filter(Boolean)
    .join(' ');
}

export const flat = (datum, out = []) => {
  if (Array.isArray(datum)) datum.map(d => flat(d, out));
  else out.push(datum);
  return out;
};