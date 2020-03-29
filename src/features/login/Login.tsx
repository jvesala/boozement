import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginUserAsync,
    selectLanguage,
    selectShowLoggedOut
} from './loginSlice';

import './Login.css';
import { i18n, Language } from '../../app/localization';
import { Busy } from '../../components/Busy';

export const Login = () => {
    const language: Language = useSelector(selectLanguage);
    const showLoggedOut: Language = useSelector(selectShowLoggedOut);

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showBusy, setShowBusy] = useState(false);

    const disabled = email.length === 0 || password.length === 0;

    const doLogin = () => {
        setShowBusy(true);
        dispatch(loginUserAsync(email, password));
    };

    return (
        <div className="Login">
            <form
                method="post"
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                {showLoggedOut ? (
                    <div className="Logout-message">
                        {i18n[language].loginForm.logoutMessage}
                    </div>
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
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password">
                    {i18n[language].loginForm.password}
                </label>
                <input
                    type="password"
                    name="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
                <div className="error" />
            </form>
        </div>
    );
};
