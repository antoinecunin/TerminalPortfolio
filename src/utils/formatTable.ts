/**
 * Format data as an aligned ASCII table.
 * Takes rows of key-value pairs and aligns the values.
 */
export function formatTable(
  rows: { key: string; value: string }[],
  separator = '  '
): string[] {
  if (rows.length === 0) return [];

  const maxKeyLen = Math.max(...rows.map((r) => r.key.length));
  return rows.map(
    (r) => `  ${r.key.padEnd(maxKeyLen)}${separator}${r.value}`
  );
}