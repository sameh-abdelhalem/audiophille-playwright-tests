export function parsePrice(text: string | null | undefined): number {
  if (!text) return 0;
  // Remove currency symbols, commas, spaces
  const cleaned = text.replace(/[^0-9.]/g, "");
  const value = parseFloat(cleaned);
  return isNaN(value) ? 0 : value;
}
