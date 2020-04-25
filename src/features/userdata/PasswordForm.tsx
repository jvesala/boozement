import React, { useState } from 'react';

import './PasswordForm.css';
import { i18n, Language } from '../../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import { updateValidity } from '../../app/form';
import { selectShowPasswordBusy } from './passwordSlice';

export const PasswordForm = () => {
    const language: Language = useSelector(selectLanguage);
    const showBusy = useSelector(selectShowPasswordBusy);
    const [disabledPassword, setDisabledPassword] = useState(true);

    // const dispatch = useDispatch();

    const doSubmit = () => {};

    return (
        <div className="PasswordForm">
            <form
                method="post"
                onChange={e => updateValidity(e, setDisabledPassword)}
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                <div>
                    <label htmlFor="password">
                        {i18n[language].userdata.passwordCurrent}
                    </label>
                </div>
                <div>
                    <input type="password" name="password" />
                    <em className="error password-error hidden">
                        {i18n[language].userdata.passwordError}
                    </em>
                </div>
                <div>
                    <label htmlFor="password">
                        {i18n[language].userdata.password}
                    </label>
                </div>
                <div>
                    <input type="password" name="password" />
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
                    disabled={disabledPassword}
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
