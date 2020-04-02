import {
    getUserByEmail,
    getUserById,
    initConnection,
    insertUser,
    User
} from '../../server/database';

describe('database.spec.ts', () => {
    const connectionString =
        'postgres://postgres:@boozement-postgres:5432/boozement-integration';
    let db: any;

    const user: User = {
        email: 'my.email@example.com',
        password: 'passwordHash',
        gender: 'M',
        weight: 100
    };

    beforeAll(async () => {
        db = await initConnection(connectionString);
        user.id = (await insertUser(db, user)).id;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    describe('getUserById', () => {
        it('gets existing user', async () => {
            const result = await getUserById(db, user.id!);
            expect(result).toEqual(user);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getUserById(db, 100000);
            expect(result).toEqual(undefined);
        });
    });

    describe('getUserById', () => {
        it('gets existing user', async () => {
            const result = await getUserByEmail(db, user.email);
            expect(result).toEqual(user);
        });

        it('returns undefined for non-existing user', async () => {
            const result = await getUserByEmail(db, 'not-my-email@example.com');
            expect(result).toEqual(undefined);
        });
    });
});
