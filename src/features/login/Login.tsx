import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginUserAsync,
    selectLanguage,
    selectShowLoggedOut
} from './loginSlice';

import './Login.css';
import { i18n, Language } from '../../app/localization';

export const Login = () => {
    const language: Language = useSelector(selectLanguage);
    const showLoggedOut: Language = useSelector(selectShowLoggedOut);

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password">
                    {i18n[language].loginForm.password}
                </label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="button"
                    type="submit"
                    onClick={() => dispatch(loginUserAsync(email, password))}
                >
                    {i18n[language].loginForm.button}
                </button>
                <div className="error" />
                <div className="busy hidden" />
            </form>
        </div>
    );
};
