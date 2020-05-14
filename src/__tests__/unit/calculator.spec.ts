import { Serving, User } from '../../server/database';
import { DateTime, Duration } from 'luxon';
import { bacNow } from '../../server/calculator';

describe('calculator.spec.ts', () => {
    const user: User = {
        email: 'my.email@example.com',
        password: 'passwordHash',
        gender: 'M',
        weight: 73000,
    };
    const serving: Serving = {
        userId: 'ffef775a-ffb3-454b-a4f1-c9883977415c',
        date: DateTime.utc().minus({ seconds: 3600 }),
        type: 'Beer',
        amount: 66,
        units: 2.0,
    };
    const serving2: Serving = {
        userId: 'ffef775a-ffb3-454b-a4f1-c9883977415c',
        date: DateTime.utc().minus({ seconds: 7200 }),
        type: 'Beer',
        amount: 66,
        units: 2.0,
    };

    describe('bacNow', () => {
        it('works with 73kg male having two units hour ago', () => {
            const result = bacNow(user, [serving]);
            expect(result).toEqual('0.31');
        });

        it('works with 73kg male having two units two hour ago', () => {
            const result = bacNow(user, [serving2]);
            expect(result).toEqual('0.17');
        });

        it('works with 73kg male having two units two hour ago and two unit one hour ago', () => {
            const result = bacNow(user, [serving2, serving]);
            expect(result).toEqual('0.61');
        });

        it('works with 73kg male having nothing', () => {
            const result = bacNow(user, []);
            expect(result).toEqual('0.00');
        });
    });
});
