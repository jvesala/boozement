const express = require('express');
const bodyparser = require('body-parser');
import { Request, Response } from 'express';


const app = express();
// const port = process.env.PORT || 5000;
const port = 5000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get('/api/hello', (_req: Request, res: Response) => {
    res.send({ express: 'Hello From Express' });
});

app.post('/login', (req: Request, res: Response) => {
    console.log('POST /login', req.body);
    res.send({ status: 'success', email: req.body.email });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
