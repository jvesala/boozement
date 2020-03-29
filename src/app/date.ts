import { DateTime } from 'luxon';

export const createDate = (date: string, time: string) => {
    return DateTime.fromISO(date + 'T' + time);
};

export const createFromUtcString = (dateString: string) => {
    return DateTime.fromISO(dateString);
};

export const formatDateTime = (dateTime: DateTime) => {
    return dateTime.toLocaleString(DateTime.DATETIME_MED);
};
