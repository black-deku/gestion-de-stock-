/**
 * Format a number as Moroccan Dirham (MAD).
 *
 * @param {number|string} value - The amount to format.
 * @returns {string} Formatted price, e.g. "1 234,50 DH"
 */
export function formatMAD(value) {
  const num = Number(value);
  if (isNaN(num)) return '0,00 DH';

  return (
    num
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DH'
  );
}
