import { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import { initPassport, isAuthenticated } from './passportUtils';
import {
    getRecentServings,
    getServings,
    getUserById,
    initConnection,
    insertServing,
    searchServings,
    searchSuggestion,
    updateField,
    updateUser,
} from './database';
import { bacNow } from './calculator';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import { validateBody } from './validator';
import {
    RecentServingsResponse,
    Serving,
    SuggestionsResponse,
    UpdatePassword,
    UpdateServing,
    UpdateUserData,
    UserDataResponse,
} from './domain';

const express = require('express');
const bodyparser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

const databaseUrl =
    process.env.DATABASE_URL ||
    'postgres://postgres:@boozement-postgres:5432/boozement';

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use(
    session({
        name: 'boozement',
        resave: false,
        saveUninitialized: true,
        secret: 'topSecretSession',
        proxy: true,
        cookie: {
            domain: 'localhost',
        },
    })
);

const { db } = initConnection(databaseUrl);
initPassport(db);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '/../')));

app.post(
    '/api/login',
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        const { user } = req;
        res.cookie('boozement-username', (user as any).email);
        (user as any).password = '*****';
        console.log('POST /api/login', user);
        res.json(user);
    }
);

app.post('/api/logout', async (req: Request, res: Response) => {
    console.log('POST /api/logout');
    req.session?.destroy(() => {
        res.clearCookie('boozement-username', undefined);
        res.send({});
    });
});

app.get(
    '/api/servings',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /api/servings', req.query);
        const { search, limit, offset } = req.query;
        const user = await getUserById(db, req.session!.passport.user);
        if (req.query.search) {
            const servings = await searchServings(
                db,
                user!.id!,
                search as string,
                parseInt(limit as string),
                parseInt(offset as string)
            );
            res.send(servings);
        } else {
            const servings = await getServings(
                db,
                user!.id!,
                parseInt(limit as string),
                parseInt(offset as string)
            );
            res.send(servings);
        }
    }
);

app.get(
    '/api/recentServings',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /api/recentServings', req.query);
        const user = await getUserById(db, req.session!.passport.user);
        const servings = await getRecentServings(
            db,
            user!.id!,
            parseInt(req.query.hours as string)
        );
        const reversed = [...servings.servings].reverse();
        const bac = bacNow(user!, reversed);
        const response: RecentServingsResponse = { servings, bac };
        res.send(response);
    }
);

app.get(
    '/api/suggestions',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /api/suggestions', req.query);
        if (req.query.search === '') {
            res.send([]);
        } else {
            const suggestions: SuggestionsResponse = await searchSuggestion(
                db,
                parseInt(req.query.limit as string),
                req.query.search as string
            );
            res.send(suggestions);
        }
    }
);

app.post(
    '/api/insert',
    isAuthenticated,
    validateBody(Serving),
    async (req: Request, res: Response) => {
        const body: Serving = req.body;
        console.log('POST /api/insert', body);
        const user = await getUserById(db, req.session!.passport.user);
        body.userId = user!.id!;
        const result: Serving = await insertServing(db, body);
        res.json(result);
    }
);

app.put(
    '/api/insert',
    isAuthenticated,
    validateBody(UpdateServing),
    async (req: Request, res: Response) => {
        const body: UpdateServing = req.body;
        console.log('POST /api/insert', body);
        const user = await getUserById(db, req.session!.passport.user);

        const result = await updateField(
            db,
            String(user!.id!),
            body.id,
            body.field,
            body.value
        );
        res.json(result);
    }
);

app.get(
    '/api/userdata',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /api/userdata');
        const user = await getUserById(db, req.session!.passport.user);
        const response: UserDataResponse = {
            weight: user?.weight!,
            gender: user?.gender!,
        };
        res.send({ ...response });
    }
);

app.put(
    '/api/userdata',
    isAuthenticated,
    validateBody(UpdateUserData),
    async (req: Request, res: Response) => {
        const body: UpdateUserData = req.body;
        console.log('PUT /api/userdata', body);
        const user = await getUserById(db, req.session!.passport.user);
        user!.weight = body.weight;
        await updateUser(db, user!);
        res.json({});
    }
);

app.post(
    '/api/password',
    isAuthenticated,
    validateBody(UpdatePassword),
    async (req: Request, res: Response) => {
        const body: UpdatePassword = req.body;
        console.log('POST /api/password', body);
        const user = await getUserById(db, req.session!.passport.user);
        if (bcrypt.compareSync(body.currentPassword, user!.password)) {
            user!.password = await bcrypt.hash(body.newPassword, 10);
            await updateUser(db, user!);
            res.json({});
        } else {
            res.sendStatus(401);
        }
    }
);

app.use('*', isAuthenticated, async (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '/../', 'index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));
