/**
 * Format a date into ISO8601
 * YYYY-MM-DD
 * @param date
 */
export function formatDateToISO8601(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}
