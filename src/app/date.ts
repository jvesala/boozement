import { DateTime } from 'luxon';
import type { Language } from './localization';

export const createDate = (date: string, time: string) => {
  return DateTime.fromISO(date + 'T' + time);
};

export const createFromUtcString = (dateString: string) => {
  return DateTime.fromISO(dateString);
};

export const formatDateTime = (dateTime: DateTime) => {
  return dateTime.toLocaleString(DateTime.DATETIME_MED);
};

export const formatDateTimeWithLanguage = (
  language: Language,
  dateTime: DateTime,
) => {
  if (language === 'fi') {
    return dateTime.setLocale('fi').toLocaleString(DateTime.DATETIME_SHORT);
  } else {
    return dateTime.setLocale('us').toLocaleString(DateTime.DATETIME_SHORT);
  }
};
