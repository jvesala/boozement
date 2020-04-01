import {
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
        email: 'email',
        password: 'password',
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
    });
});
