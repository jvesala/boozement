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
import { DateTime, Duration } from 'luxon';

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
    const user2: User = {
        ...user
    };
    user2.email = 'my2.email@example.com';

    const serving: Serving = {
        userId: 0,
        date: DateTime.utc(),
        type: 'Beer',
        amount: 33,
        units: 1.0
    };
    const serving2: Serving = {
        ...serving
    };
    serving2.type = 'Cider';
    serving2.date = serving2.date.minus(Duration.fromISO('P1D'));

    const serving3: Serving = {
        ...serving
    };
    serving3.type = 'Cider';
    serving3.date = serving3.date.minus(Duration.fromISO('P2D'));

    beforeAll(async () => {
        const res = await initConnection(connectionString);
        pgp = res.pgp;
        db = res.db;
        await db.any('DELETE FROM servings');
        await db.any('DELETE FROM users');
        user.id = (await insertUser(db, user)).id;
        user2.id = (await insertUser(db, user2)).id;
        serving.userId = user.id!;
        serving2.userId = user.id!;
        serving3.userId = user2.id!;
        serving.id = (await insertServing(db, serving)).id;
        serving2.id = (await insertServing(db, serving2)).id;
        serving3.id = (await insertServing(db, serving3)).id;
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
            const result = await getServings(db, user.id!, 100, 0);
            expect(result).toEqual([serving, serving2]);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getServings(db, 100000, 100, 0);
            expect(result).toEqual([]);
        });
    });
});
