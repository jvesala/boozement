import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectLanguage, selectShowLoggedOut } from './loginSlice';

import './Login.css';
import { i18n, Language } from '../../app/localization';
import { Busy } from '../../components/Busy';
import { Error } from '../../components/Error';
import { doPostRequest } from '../../app/network';
import { User } from '../../server/domain';

export const Login = () => {
    const language: Language = useSelector(selectLanguage);
    const showLoggedOut: Language = useSelector(selectShowLoggedOut);

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showBusy, setShowBusy] = useState(false);
    const [showLoginError, setShowLoginError] = useState(false);

    const disabled = email.length === 0 || password.length === 0;

    const doLogin = async () => {
        const payload = {
            email,
            password,
        };
        const url = '/api/login';

        setShowBusy(true);
        const successHandler = (success: User) => {
            setShowBusy(false);
            setShowLoginError(false);
            dispatch(loginUser(success.email));
        };
        const errorHandler = (err: Error) => {
            console.error(err);
            setShowBusy(false);
            setShowLoginError(true);
        };
        await doPostRequest(url, payload, successHandler, errorHandler);
    };

    return (
        <div className="Login">
            <form
                method="post"
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                {showLoggedOut ? (
                    <div>{i18n[language].loginForm.logoutMessage}</div>
                ) : (
                    ''
                )}

                <h3>{i18n[language].loginForm.title}</h3>
                <label htmlFor="email">{i18n[language].loginForm.email}</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">
                    {i18n[language].loginForm.password}
                </label>
                <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="button"
                    type="submit"
                    onClick={doLogin}
                    disabled={disabled}
                >
                    {i18n[language].loginForm.button}
                </button>
                <Busy visible={showBusy} />
                <Error
                    visible={showLoginError}
                    text={i18n[language].loginForm.error}
                />
            </form>
        </div>
    );
};
