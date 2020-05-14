import React, { useState } from 'react';

import './PasswordForm.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import { updateValidity } from '../../app/form';
import {
    selectCopyPassword,
    selectCurrentPassword,
    selectNewPassword,
    selectPasswordResult,
    selectShowPasswordBusy,
    selectShowPasswordError,
    setCopyPassword,
    setCurrentPassword,
    setNewPassword,
    setShowPasswordBusy,
    updatePasswordAsync,
} from './passwordSlice';
import { Error } from '../../components/Error';

export const PasswordForm = () => {
    const language: Language = useSelector(selectLanguage);

    const currentPassword = useSelector(selectCurrentPassword);
    const newPassword = useSelector(selectNewPassword);
    const copyPassword = useSelector(selectCopyPassword);

    const showBusy = useSelector(selectShowPasswordBusy);
    const [disabled, setDisabled] = useState(true);

    const passwordResult = useSelector(selectPasswordResult);
    const passwordError = useSelector(selectShowPasswordError);

    const dispatch = useDispatch();

    const doSubmit = () => {
        setDisabled(true);
        dispatch(setShowPasswordBusy(true));
        const payload = {
            currentPassword,
            newPassword,
        };
        dispatch(updatePasswordAsync(payload));
    };

    return (
        <div className="PasswordForm">
            <form
                method="post"
                onChange={(e) => updateValidity(e, setDisabled)}
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <div>
                    <label htmlFor="password">
                        {i18n[language].password.current}
                    </label>
                </div>
                <div>
                    <input
                        type="password"
                        name="current"
                        value={currentPassword}
                        required
                        onChange={(e) =>
                            dispatch(setCurrentPassword(e.target.value))
                        }
                    />
                </div>
                <div>
                    <label htmlFor="password">
                        {i18n[language].password.new}
                    </label>
                </div>
                <div>
                    <input
                        type="password"
                        name="new"
                        value={newPassword}
                        minLength={10}
                        maxLength={200}
                        required
                        onChange={(e) =>
                            dispatch(setNewPassword(e.target.value))
                        }
                    />
                </div>
                <div>
                    <label htmlFor="copy">{i18n[language].password.copy}</label>
                </div>
                <div>
                    <input
                        type="password"
                        name="copy"
                        value={copyPassword}
                        minLength={10}
                        maxLength={200}
                        required
                        onChange={(e) =>
                            dispatch(setCopyPassword(e.target.value))
                        }
                    />
                    <Error
                        visible={newPassword !== copyPassword}
                        text={i18n[language].password.errorMatch}
                    />
                </div>
                <button
                    className="button"
                    type="submit"
                    onClick={doSubmit}
                    disabled={disabled}
                >
                    {i18n[language].password.button}
                </button>
                <Busy visible={showBusy} />

                {passwordResult ? (
                    <div>{i18n[language].password.result}</div>
                ) : (
                    ''
                )}

                <Error
                    visible={passwordError}
                    text={i18n[language].password.error}
                />
            </form>
        </div>
    );
};
