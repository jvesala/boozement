import { DateTime } from 'luxon';
import * as t from 'io-ts'
import { either } from 'fp-ts/lib/Either'

export type ServingsResponse = {
    search: string;
    servings: Serving[];
    totalCount: number;
    totalUnits: number;
};

export interface DateTimeFromStringC extends t.Type<DateTime, string, unknown> {}

export const DateTimeFromString: DateTimeFromStringC = new t.Type<DateTime, string, unknown>(
    'DateTimeFromString',
    (u): u is DateTime => u instanceof DateTime,
    (u, c) =>
        either.chain(t.string.validate(u, c), n => {
            const d = DateTime.fromISO(n)
            return (d == null) ? t.failure(u, c) : t.success(d)
        }),
    a => a.toUTC().toISO()
)

const IdType = t.union([t.string, t.undefined])
const GenderType = t.union([t.literal('M'), t.literal('F')])
export type Gender = t.TypeOf<typeof GenderType>

const ServingType = t.strict({
    id: IdType,
    userId: t.string,
    date: DateTimeFromString,
    type: t.string,
    amount: t.number,
    units: t.number
});
export type Serving = t.TypeOf<typeof ServingType>

const UserType = t.strict({
    id: IdType,
    email: t.string,
    password: t.string,
    gender: GenderType,
    weight: t.number,
});
export type User = t.TypeOf<typeof UserType>
