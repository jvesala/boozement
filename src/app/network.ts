import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

const superagent = require('superagent');

export const doPostRequest = async (url: string, payload: any) => {
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
                (err) => `${err.message}`,
                (success) => success.body
            )
        )
    );
};

export const doPostRequest2 = async (url: string, payload: any) => {
    const contentType = 'application/json;charset=utf-8';

    const doRequest = TE.tryCatch<Error, any>(
        () =>
            superagent.post(url).type(contentType).send(payload).timeout(30000),
        (reason) => new Error(String(reason))
    );
    return doRequest();
};

export const doPutRequest = async (url: string, payload: any) => {
    const contentType = 'application/json;charset=utf-8';
    const response = await superagent
        .put(url)
        .type(contentType)
        .send(payload)
        .timeout(30000);
    return response.body;
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
