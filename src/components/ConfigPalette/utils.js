export const fetchFont = (() => {
  const results = [];

  const fetchFontString = async (path) => {
    const response = await fetch(path);
    const blob = await response.blob();
    const content = await fileReader(blob);
    results.push({ path, content });
    return content;
  };

  return async (fontPath) => {
    const cached = results.find((result) => result.path === fontPath);
    return cached ? cached.content : await fetchFontString(fontPath);
  };
})();

const fileReader = (blob) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => resolve(reader.result);
  });
