import {
  getRecentServings,
  getServings,
  getUserByEmail,
  getUserById,
  initConnection,
  insertServing,
  insertUser,
  updateField,
  updateUser,
} from '../../server/database';
import { DateTime, Duration } from 'luxon';
import { Serving, User } from '../../server/domain';

describe('database.spec.ts', () => {
  const connectionString =
    'postgres://postgres:@boozement-postgres:5432/boozement-integration';
  let pgp: any;
  let db: any;

  const user: User = {
    id: undefined,
    email: 'my.email@example.com',
    password: 'passwordHash',
    gender: 'M',
    weight: 100,
  };
  const user2: User = {
    ...user,
  };
  user2.email = 'my2.email@example.com';
  const userUpdate: User = {
    ...user,
  };
  userUpdate.email = 'myUpdate.email@example.com';

  const serving: Serving = {
    id: undefined,
    userId: 'ffef775a-ffb3-454b-a4f1-c9883977415c',
    date: DateTime.utc(),
    type: 'Beer',
    amount: 33,
    units: 1.0,
  };
  const serving2: Serving = {
    ...serving,
  };
  serving2.type = 'Cider';
  serving2.date = serving2.date.minus(Duration.fromISO('P1D'));

  const serving3: Serving = {
    ...serving,
  };
  serving3.type = 'Cider';
  serving3.date = serving3.date.minus(Duration.fromISO('P2D'));

  const servingUpdate: Serving = {
    ...serving,
  };

  beforeAll(async () => {
    const res = await initConnection(connectionString);
    pgp = res.pgp;
    db = res.db;
    await db.any('DELETE FROM servings');
    await db.any('DELETE FROM users');
    user.id = (await insertUser(db, user)).id;
    user2.id = (await insertUser(db, user2)).id;
    userUpdate.id = (await insertUser(db, userUpdate)).id;
    serving.userId = user.id!;
    serving2.userId = user.id!;
    serving3.userId = user2.id!;
    servingUpdate.userId = user2.id!;
    serving.id = (await insertServing(db, serving)).id;
    serving2.id = (await insertServing(db, serving2)).id;
    serving3.id = (await insertServing(db, serving3)).id;
    servingUpdate.id = (await insertServing(db, servingUpdate)).id;
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
      const result = await getUserById(
        db,
        'ffef775a-ffb3-454b-a4f1-c9883977415b',
      );
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

  describe('updateUser', () => {
    it('update all fields', async () => {
      const userUpdated: User = {
        id: userUpdate.id,
        email: 'myUpdate.email3@example.com',
        password: 'passwordHashUpdated',
        gender: 'F',
        weight: 12222,
      };
      await updateUser(db, userUpdated);
      const result = await getUserByEmail(db, 'myUpdate.email3@example.com');
      expect(result).toEqual(userUpdated);
    });
  });

  describe('updateField', () => {
    it('update all fields', async () => {
      const newDate = DateTime.utc();
      await updateField(
        db,
        String(servingUpdate.userId),
        String(servingUpdate.id),
        'date',
        newDate.toISO(),
      );
      await updateField(
        db,
        String(servingUpdate.userId),
        String(servingUpdate.id),
        'type',
        'New Hipster Beer',
      );
      await updateField(
        db,
        String(servingUpdate.userId),
        String(servingUpdate.id),
        'amount',
        '111',
      );
      const result = await updateField(
        db,
        String(servingUpdate.userId),
        String(servingUpdate.id),
        'units',
        '666',
      );
      expect(result).toEqual({
        id: servingUpdate.id,
        type: 'New Hipster Beer',
        units: 666,
        userId: servingUpdate.userId,
        date: newDate,
        amount: 111,
      });
    });
  });

  describe('getServings', () => {
    it('get servings', async () => {
      const result = await getServings(db, user.id!, 100, 0);
      expect(result).toEqual({
        search: '',
        totalCount: 2,
        totalUnits: 2,
        servings: [serving, serving2],
      });
    });

    it('returns undefined for non-existing user', async () => {
      const result = await getServings(
        db,
        'acf556cc-72ab-4a04-922b-829116ab7638',
        100,
        0,
      );
      expect(result).toEqual({
        search: '',
        totalCount: 0,
        servings: [],
        totalUnits: 0,
      });
    });
  });

  describe('getRecentServings', () => {
    it('get servings 1h', async () => {
      const result = await getRecentServings(db, user.id!, 1);
      expect(result).toEqual({
        search: '',
        totalCount: 1,
        totalUnits: 1,
        servings: [serving],
      });
    });

    it('get servings 25h', async () => {
      const result = await getRecentServings(db, user.id!, 25);
      expect(result).toEqual({
        search: '',
        totalCount: 2,
        totalUnits: 2,
        servings: [serving, serving2],
      });
    });

    it('returns undefined for non-existing user', async () => {
      const result = await getServings(
        db,
        'acf556cc-72ab-4a04-922b-829116ab7638',
        100,
        0,
      );
      expect(result).toEqual({
        search: '',
        totalCount: 0,
        servings: [],
        totalUnits: 0,
      });
    });
  });
});
