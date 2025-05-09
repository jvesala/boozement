import { DateTime } from 'luxon';
import { Serving, User } from './domain';

export const gramsInUnit = 12;
export const hourInMillis = 3600 * 1000;

const alcoholInGramsInServing = (serving: Serving) =>
  serving.units * gramsInUnit;

export const weightInKilos = (weight: number) => weight / 1000;

const genderFactor = (gender: String) => (gender === 'M' ? 0.75 : 0.66);

const burnRateInMillis = (weight: number) =>
  (0.1 * weightInKilos(weight)) / hourInMillis;

const max = (a: number, b: number) => (a > b ? a : b);

const remainingAmount = (
  weight: number,
  startGrams: number,
  start: DateTime,
  end: DateTime,
) =>
  max(startGrams - burnRateInMillis(weight) * end.diff(start).milliseconds, 0);

const gramsToBac = (user: User, grams: number) =>
  (grams / (genderFactor(user.gender) * user.weight)) * 1000;

const formatBac = (num: number) => (Math.round(num * 100) / 100).toFixed(2);

export type GramsAt = {
  at: DateTime;
  grams: number;
};

const calculateBacHistory = (
  user: User,
  now: DateTime,
  servings: Serving[],
) => {
  const endServing: Serving = {
    id: undefined,
    date: now,
    userId: '',
    type: '',
    amount: 0,
    units: 0,
  };
  const servingsUntilNow = [...servings, endServing];
  const startTime = servingsUntilNow[0].date;
  const startEntry: GramsAt = { at: startTime, grams: 0 };

  const gramHistory = servingsUntilNow.reduce(
    (bacHistory: GramsAt[], next: Serving) => {
      const lastEntry = bacHistory[bacHistory.length - 1];
      const nextEntry: GramsAt = {
        grams:
          remainingAmount(
            user.weight,
            lastEntry.grams,
            lastEntry.at,
            next.date,
          ) + alcoholInGramsInServing(next),
        at: next.date,
      };
      return [...bacHistory, nextEntry];
    },
    [startEntry],
  );
  return gramHistory.map((entry) => {
    return gramsToBac(user, entry.grams);
  });
};

export const bacNow = (user: User, servings: Serving[]) =>
  formatBac(calculateBacHistory(user, DateTime.utc(), servings).pop()!);
