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
