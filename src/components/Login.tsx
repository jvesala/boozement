import React from 'react';
import './Login.css';

export const Login = () => {
    return (
        <div className="Login">
            <form action="api/login" method="post" className="Form">
                <div className="Logout-message">Olet kirjautunut ulos.</div>
                <h3>Kirjaudu sisään</h3>
                <label htmlFor="email">Sähköpostiosoite</label>
                <input type="email" name="email" />
                <label htmlFor="password">Salasana</label>
                <input type="password" name="password" />
                <div id="result"></div>
                <div id="error"></div>
                <button className="button" type="submit" id="submit">
                    Kirjaudu
                </button>
                <div className="busy hidden"></div>
            </form>
        </div>
    );
};
