import { DateTime } from 'luxon'

export const fromDateToISO = (date: Date): string | null => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return DateTime.fromISO(newDate.toISOString()).toISO();
}

export const fromStringToLocalString = (date: string): string | null => {
  const newDate = new Date(date)
  return DateTime.fromISO(newDate.toISOString()).toFormat('yyyy-MM-DD');
}