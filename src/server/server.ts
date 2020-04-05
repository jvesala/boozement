import { Request, Response } from 'express';
import session from 'express-session';
import passport from 'passport';

import { initPassport, isAuthenticated } from './passportUtils';
import {
    getRecentServings,
    getServings,
    getUserById,
    initConnection,
    insertServing
} from './database';

const express = require('express');
const bodyparser = require('body-parser');

const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

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
            domain: 'localhost'
        }
    })
);
const connectionString =
    'postgres://postgres:@boozement-postgres:5432/boozement';

const { db } = initConnection(connectionString);
initPassport(db);
app.use(passport.initialize());
app.use(passport.session());

app.get('/servings', isAuthenticated, async (req: Request, res: Response) => {
    console.log('POST /servings', req.params);
    const user = await getUserById(db, req.session!.passport.user);
    const servings = await getServings(db, user!.id!, 100, 0);
    res.send(servings);
});

app.get(
    '/recentServings',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('POST /recentServings', req.query);
        const user = await getUserById(db, req.session!.passport.user);
        const servings = await getRecentServings(
            db,
            user!.id!,
            parseInt(req.query.hours)
        );
        res.send(servings);
    }
);

app.post('/insert', isAuthenticated, async (req: Request, res: Response) => {
    const body = req.body;
    console.log('POST /insert', body);
    const user = await getUserById(db, req.session!.passport.user);
    body.userId = user!.id!;
    await insertServing(db, body);
    res.json(body);
});

app.post(
    '/login',
    passport.authenticate('local'),
    (req: Request, res: Response) => {
        const { user } = req;
        res.cookie('boozement-username', (user as any).email);
        (user as any).password = '*****';
        console.log('POST /login', user);
        res.json(user);
    }
);

app.post('/logout', async (req: Request, res: Response) => {
    console.log('POST /logout');
    req.session?.destroy(() => {
        res.clearCookie('boozement-username', undefined);
        res.send({});
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
