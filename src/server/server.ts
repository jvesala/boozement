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
    updateUser
} from './database';
import { bacNow } from './calculator';
import * as bcrypt from 'bcrypt';

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
    console.log('GET /servings', req.query);
    const user = await getUserById(db, req.session!.passport.user);
    if (req.query.search) {
        const servings = await searchServings(
            db,
            user!.id!,
            req.query.search,
            req.query.limit,
            req.query.offset
        );
        res.send(servings);
    } else {
        const servings = await getServings(
            db,
            user!.id!,
            req.query.limit,
            req.query.offset
        );
        res.send(servings);
    }
});

app.get(
    '/recentServings',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /recentServings', req.query);
        const user = await getUserById(db, req.session!.passport.user);
        const servings = await getRecentServings(
            db,
            user!.id!,
            parseInt(req.query.hours)
        );
        const reversed = [...servings.servings].reverse();
        const bac = bacNow(user!, reversed);
        res.send({ servings, bac });
    }
);

app.get(
    '/suggestions',
    isAuthenticated,
    async (req: Request, res: Response) => {
        console.log('GET /suggestions', req.query);
        if (req.query.search === '') {
            res.send([]);
        } else {
            const suggestions = await searchSuggestion(
                db,
                req.query.limit,
                req.query.search
            );
            res.send(suggestions);
        }
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

app.put('/insert', isAuthenticated, async (req: Request, res: Response) => {
    const body = req.body;
    console.log('POST /put', body);
    const user = await getUserById(db, req.session!.passport.user);

    const servingId = req.body.id;
    const field = req.body.field;
    const value = req.body.value;

    const result = await updateField(
        db,
        String(user!.id!),
        servingId,
        field,
        value
    );
    res.json(result);
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

app.get('/userdata', isAuthenticated, async (req: Request, res: Response) => {
    console.log('GET /userdata');
    const user = await getUserById(db, req.session!.passport.user);
    res.send({ weight: user?.weight, gender: user?.gender });
});

app.put('/userdata', isAuthenticated, async (req: Request, res: Response) => {
    const body = req.body;
    console.log('PUT /userdata', body);
    const user = await getUserById(db, req.session!.passport.user);
    user!.weight = body.weight;
    await updateUser(db, user!);
    res.json({});
});

app.post('/password', isAuthenticated, async (req: Request, res: Response) => {
    const body = req.body;
    console.log('POST /password', body);
    const user = await getUserById(db, req.session!.passport.user);
    if (bcrypt.compareSync(body.currentPassword, user!.password)) {
        user!.password = await bcrypt.hash(body.newPassword, 10);
        await updateUser(db, user!);
        res.json({});
    } else {
        res.sendStatus(401);
    }
});

app.post('/logout', async (req: Request, res: Response) => {
    console.log('POST /logout');
    req.session?.destroy(() => {
        res.clearCookie('boozement-username', undefined);
        res.send({});
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
