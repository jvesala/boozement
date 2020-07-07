import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

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
        (reason) => new Error(String(reason))
    );
    return doRequest().then((e) =>
        pipe(
            e,
            E.fold(
                (err) => errorHandler(err),
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
        (reason) => new Error(String(reason))
    );
    return doRequest().then((e) =>
        pipe(
            e,
            E.fold(
                (err) => errorHandler(err),
                (success: T) => successHandler(success)
            )
        )
    );
};

export const doGetRequest = async (url: string, query: any) => {
    const contentType = 'application/json;charset=utf-8';
    const response = await superagent
        .get(url)
        .type(contentType)
        .query(query)
        .timeout(30000);
    return response.body;
};
