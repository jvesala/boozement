import React, { useState } from 'react';

import './Userdata.css';
import { i18n, Language } from '../../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage, selectUsername } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import { selectShowUserdataBusy } from './userdataSlice';

export const Userdata = () => {
    const language: Language = useSelector(selectLanguage);
    const username: Language = useSelector(selectUsername);
    const showBusy = useSelector(selectShowUserdataBusy);

    const [disabled, setDisabled] = useState(true);

    const updateValidity = (e: any) => {
        setDisabled(!e.target.closest('form').checkValidity());
    };

    const doSubmit = () => {};

    return (
        <div className="Userdata">
            <form
                method="post"
                onChange={e => updateValidity(e)}
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                <div>
                    <label htmlFor="email">
                        {i18n[language].userdata.email}
                    </label>
                </div>
                <div>
                    <input type="text" value={username} readOnly={true} />
                </div>

                <div>
                    <label>{i18n[language].userdata.gender}</label>
                </div>
                <div>
                    <input type="text" value={''} readOnly={true} />
                </div>

                <div>
                    <label htmlFor="weight">
                        {i18n[language].userdata.weight}
                    </label>
                </div>
                <div>
                    <input id="weight" name="weight" />
                    <em className="weightTitle">
                        {i18n[language].userdata.weightTitle}
                    </em>
                    <em className="error weight-error hidden">
                        {i18n[language].userdata.weightError}
                    </em>
                </div>

                <div>
                    <label htmlFor="password">
                        {i18n[language].userdata.password}
                    </label>
                </div>
                <div>
                    <input type="password" name="password" />
                    <em className="error password-error hidden">
                        {i18n[language].userdata.passwordError}
                    </em>
                </div>
                <div>
                    <label htmlFor="password-copy">
                        {i18n[language].userdata.passwordRetry}
                    </label>
                </div>
                <div>
                    <input type="password" name="password-copy" />
                    <em className="error password-match-error hidden">
                        {i18n[language].userdata.passwordErrorMismatch}
                    </em>
                </div>
                <button
                    className="button"
                    type="submit"
                    onClick={doSubmit}
                    disabled={disabled}
                >
                    {i18n[language].userdata.button}
                </button>
                <Busy visible={showBusy} />

                <div id="result"></div>
                <div id="error"></div>
            </form>
        </div>
    );
};
