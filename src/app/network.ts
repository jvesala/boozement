import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { loginUser } from '../features/login/loginSlice';

import superagent from 'superagent';

const contentType = 'application/json;charset=utf-8';

const toError = (reason: any) =>
  new Error(`${reason.status}:${reason.message}`);

const getBody = (r: any) => r.body;

const handle = <T>(
  errorHandler: (err: Error) => void,
  successHandler: (s: T) => void,
) =>
  E.fold(
    (err: Error) => errorHandler(err),
    (success: T) => successHandler(success),
  );

export const doPostRequest = async <T>(
  url: string,
  payload: any,
  successHandler: (s: T) => void,
  errorHandler: (err: Error) => void,
) =>
  TE.tryCatch<Error, T>(
    () =>
      superagent
        .post(url)
        .type(contentType)
        .send(payload)
        .timeout(30000)
        .then(getBody),
    (reason: any) => toError(reason),
  )().then((e) => pipe(e, handle(errorHandler, successHandler)));

export const doPutRequest = async <T>(
  url: string,
  payload: any,
  successHandler: (s: T) => void,
  errorHandler: (err: Error) => void,
) =>
  TE.tryCatch<Error, T>(
    () =>
      superagent
        .put(url)
        .type(contentType)
        .send(payload)
        .timeout(30000)
        .then(getBody),
    (reason: any) => toError(reason),
  )().then((e) => pipe(e, handle(errorHandler, successHandler)));

export const doGetRequest = async <T>(
  url: string,
  query: any,
  successHandler: (s: T) => void,
  errorHandler: (err: Error) => void,
) =>
  TE.tryCatch<Error, T>(
    () =>
      superagent
        .get(url)
        .type(contentType)
        .query(query)
        .timeout(30000)
        .then(getBody),
    (reason: any) => toError(reason),
  )().then((e) => pipe(e, handle(errorHandler, successHandler)));

export const forwardLoginIfUnauthorized = (dispatch: any, err: Error) => {
  if (err.message === '401:Unauthorized') {
    dispatch(loginUser(undefined));
  }
};
