export function extractFloorNumber(floorName) {
  if (!floorName) return null;

  // шукаємо перше ціле число зі знаком
  const match = floorName.match(/-?\d+/);

  if (!match) return null;

  return Number(match[0]); // наприклад: "-2" → -2
}
