const superagent = require('superagent');

export const doPostRequest = async (url: string, payload: any) => {
    const contentType = 'application/json;charset=utf-8';
    const response = await superagent
        .post(url)
        .type(contentType)
        .send(payload)
        .timeout(30000);
    return response.body;
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
