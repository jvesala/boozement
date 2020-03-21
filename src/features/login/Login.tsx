import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from './loginSlice';

import './Login.css';
import { i18n, Language } from '../../app/localization';

export const Login = () => {
    const language: Language = 'fi';

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
                <div className="Logout-message">
                    {i18n[language].loginForm.logoutMessage}
                </div>
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
                <div id="result" />
                <div id="error" />
                <button
                    className="button"
                    type="submit"
                    id="submit"
                    onClick={() => dispatch(loginUser(email + ':' + password))}
                >
                    {i18n[language].loginForm.button}
                </button>
                <div className="busy hidden" />
            </form>
        </div>
    );
};
