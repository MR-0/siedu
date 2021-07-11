export const toUrlString = (obj, union) => {
  const keys = Object.keys(obj);
  return keys
    .map(key => encodeURI(key) + '=' + encodeURI(obj[key]))
    .join(union);
};