import React from 'react';

import './History.css';
import { i18n, Language } from '../../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';

export const Userdata = () => {
    const language: Language = useSelector(selectLanguage);

    return (
        <div className="Userdata">
            <form method="post">
                <label htmlFor="email">{i18n[language].userdata.email}</label>
                <span />
                <label>{i18n[language].userdata.gender}</label>
                <span />

                <label htmlFor="weight">{i18n[language].userdata.weight}</label>
                <input id="weight" name="weight" />
                <em className="weightTitle">
                    {i18n[language].userdata.weightTitle}
                </em>
                <em className="error weight-error hidden">
                    {i18n[language].userdata.weightError}
                </em>
                <label htmlFor="password">
                    {i18n[language].userdata.password}
                </label>
                <input type="password" name="password" />
                <em className="error password-error hidden">
                    {i18n[language].userdata.passwordError}
                </em>
                <label htmlFor="password-copy">
                    {i18n[language].userdata.passwordRetry}
                </label>
                <input type="password" name="password-copy" />
                <em className="error password-match-error hidden">
                    {i18n[language].userdata.passwordErrorMismatch}
                </em>
                <button type="submit"> {i18n[language].userdata.button}</button>
                <div className="busy hidden"></div>
                <div id="result"></div>
                <div id="error"></div>
            </form>
        </div>
    );
};
