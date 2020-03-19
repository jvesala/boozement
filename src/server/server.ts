//import express from 'express';
// import bodyParser from 'body-parser';

const express = require('express');
import { Request, Response } from 'express';

import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/hello', (_req: Request, res: Response) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/api/world', (req: Request, res: Response) => {
    console.log(req.body);
    res.send(
        `I received your POST request. This is what you sent me: ${req.body.post}`
    );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
