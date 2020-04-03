import {
    getServings,
    getUserByEmail,
    getUserById,
    initConnection,
    insertServing,
    insertUser,
    Serving,
    User
} from '../../server/database';
import { DateTime } from 'luxon';

describe('database.spec.ts', () => {
    const connectionString =
        'postgres://postgres:@boozement-postgres:5432/boozement-integration';
    let pgp: any;
    let db: any;

    const user: User = {
        email: 'my.email@example.com',
        password: 'passwordHash',
        gender: 'M',
        weight: 100
    };

    const serving: Serving = {
        userId: 0,
        date: DateTime.utc(),
        type: 'Beer',
        amount: 33,
        units: 1.0
    };

    beforeAll(async () => {
        const res = await initConnection(connectionString);
        pgp = res.pgp;
        db = res.db;
        user.id = (await insertUser(db, user)).id;
        serving.userId = user.id!;
        serving.id = (await insertServing(db, serving)).id;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    afterAll(async () => {
        pgp.end();
    });

    describe('getUserById', () => {
        it('gets existing user', async () => {
            const result = await getUserById(db, user.id!);
            expect(result).toEqual(user);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getUserById(db, 100000);
            expect(result).toEqual(null);
        });
    });

    describe('getUserByEmail', () => {
        it('gets existing user', async () => {
            const result = await getUserByEmail(db, user.email);
            expect(result).toEqual(user);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getUserByEmail(db, 'not-my-email@example.com');
            expect(result).toEqual(null);
        });
    });

    describe('getServings', () => {
        it('get servings', async () => {
            const result = await getServings(db, user.id!);
            expect(result).toEqual([serving]);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getServings(db, 100000);
            expect(result).toEqual([]);
        });
    });
});
