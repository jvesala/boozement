import { Request, Response } from 'express';
import { getUserByEmail, getUserById } from './database';
import { Language } from '../app/localization';
import { configureStoreWithState } from '../app/store';
import * as React from 'react';
import { App } from '../App';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import fs from 'fs';
import { weightInKilos } from './calculator';
import { StaticRouter } from 'react-router-dom/server';

export const tryCatchHandler = async (
  req: Request,
  res: Response,
  fn: () => void,
): Promise<void> => {
  try {
    console.log(`${req.method} ${req.url}`, req.body);
    fn();
  } catch (e: any) {
    console.log('API error', e);
    res.status(500).json(JSON.stringify({ msg: e.message }));
  }
};

const getLoggedInEmail = async (
  req: Request,
  db: any,
): Promise<string | undefined> => {
  const uuid =
    req.session && req.session.passport ? req.session.passport.user : undefined;
  const user = uuid ? await getUserById(db, uuid) : undefined;
  return user?.email;
};

const getUserdata = async (db: any, email?: string) => {
  const user = email ? await getUserByEmail(db, email) : undefined;
  const weight = user?.weight ? weightInKilos(user?.weight) : undefined;
  return {
    weight,
    gender: user?.gender,
  };
};

export const htmlHandler = (db: any) => async (req: Request, res: Response) => {
  const email = await getLoggedInEmail(req, db);
  const userdata = await getUserdata(db, email);

  const state = {
    login: {
      language: 'fi' as Language,
      username: email,
    },
    userdata,
  };

  const updatedStore = configureStoreWithState(state);
  const application = React.createElement(App, {});
  const router = React.createElement(
    StaticRouter,
    { location: req.url },
    application,
  );
  const provider = React.createElement(
    Provider,
    { store: updatedStore, children: undefined },
    router,
  );
  const component = renderToString(provider);
  const preloadedState = JSON.stringify(state).replace(/</g, '\\u003c');
  const file = await fs.readFileSync('./build/index.html').toString();
  const html = file
    .replace(
      'window.__PRELOADED_STATE__',
      `window.__PRELOADED_STATE__ = ${preloadedState}`,
    )
    .replace('YYY', component);
  res.send(html);
};
