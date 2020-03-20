import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from './loginSlice';

import './Login.css';

export const Login = () => {
    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className="Login">
            <form action="api/login" method="post" className="Form" onSubmit={e => { e.preventDefault() }}>
                <div className="Logout-message">Olet kirjautunut ulos.</div>
                <h3>Kirjaudu sisään</h3>
                <label htmlFor="email">Sähköpostiosoite</label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <label htmlFor="password">Salasana</label>
                <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <div id="result"></div>
                <div id="error"></div>
                <button
                    className="button"
                    type="submit"
                    id="submit"
                    onClick={() => dispatch(loginUser(email + ':' + password))}
                >
                    Kirjaudu
                </button>
                <div className="busy hidden"></div>
            </form>
        </div>
    );
};
