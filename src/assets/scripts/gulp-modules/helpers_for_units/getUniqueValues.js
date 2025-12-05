export function getUniqueValues(list, mapper) {
  const set = new Set();
  list.forEach(item => {
    const value = mapper(item);
    if (value !== undefined && value !== null && value !== '') {
      set.add(value);
    }
  });
  return Array.from(set);
}
