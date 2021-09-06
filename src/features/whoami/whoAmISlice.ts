import { doGetRequest, forwardLoginIfUnauthorized } from '../../app/network';
import { WhoAmIResponse } from '../../server/domain';
import { slice } from '../login/loginSlice';

export const { loginUser } = slice.actions;

export const whoAmIAsync = () => async (dispatch: any) => {
    const url = '/api/whoami';
    const successHandler = (success: WhoAmIResponse) => {
        dispatch(loginUser(success.email));
    };
    const errorHandler = (err: Error) => {
        forwardLoginIfUnauthorized(dispatch, err);
        console.error(err);
    };
    await doGetRequest(url, {}, successHandler, errorHandler);
};
