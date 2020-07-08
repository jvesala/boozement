import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { loginUser } from '../features/login/loginSlice';

const superagent = require('superagent');

export const doPostRequest = async <T>(
    url: string,
    payload: any,
    successHandler: (s: T) => void,
    errorHandler: (err: any) => void
) => {
    const contentType = 'application/json;charset=utf-8';

    const doRequest = TE.tryCatch<Error, any>(
        () =>
            superagent.post(url).type(contentType).send(payload).timeout(30000),
        (reason: any) => new Error(`${reason.status}:${reason.message}`)
    );
    return doRequest().then((e) =>
        pipe(
            e,
            E.fold(
                (err: Error) => errorHandler(err),
                (success: T) => successHandler(success)
            )
        )
    );
};

export const doPutRequest = async <T>(
    url: string,
    payload: any,
    successHandler: (s: T) => void,
    errorHandler: (err: any) => void
) => {
    const contentType = 'application/json;charset=utf-8';

    const doRequest = TE.tryCatch<Error, any>(
        () =>
            superagent.put(url).type(contentType).send(payload).timeout(30000),
        (reason: any) => new Error(`${reason.status}:${reason.message}`)
    );
    return doRequest().then((e) =>
        pipe(
            e,
            E.fold(
                (err: Error) => errorHandler(err),
                (success: T) => successHandler(success)
            )
        )
    );
};

export const doGetRequest = async <T>(
    url: string,
    query: any,
    successHandler: (s: T) => void,
    errorHandler: (err: any) => void
) => {
    const contentType = 'application/json;charset=utf-8';

    const doRequest = TE.tryCatch<Error, any>(
        () => superagent.get(url).type(contentType).query(query).timeout(30000),
        (reason: any) => new Error(`${reason.status}:${reason.message}`)
    );
    return doRequest().then((e) =>
        pipe(
            e,
            E.fold(
                (err: Error) => errorHandler(err),
                (success: T) => successHandler(success)
            )
        )
    );
};

export const forwardLoginIfUnauthorized = (dispatch: any, err: Error) => {
    if (err.message === '401:Unauthorized') {
        dispatch(loginUser(undefined));
    }
};
