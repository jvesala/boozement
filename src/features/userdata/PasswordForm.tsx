import React, { useState } from 'react';

import './PasswordForm.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import { updateValidity } from '../../app/form';
import { Error } from '../../components/Error';
import { doPostRequest, forwardLoginIfUnauthorized } from '../../app/network';
import { Button } from '../../components/Button';

export const PasswordForm = () => {
    const language: Language = useSelector(selectLanguage);

    const [disabled, setDisabled] = useState(true);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [copyPassword, setCopyPassword] = useState('');
    const [showBusy, setShowBusy] = useState(false);

    const [passwordError, setPasswordError] = useState(false);
    const [passwordResult, setPasswordResult] = useState(false);

    const dispatch = useDispatch();

    const doSubmit = async () => {
        setDisabled(true);

        setShowBusy(true);
        const payload = {
            currentPassword,
            newPassword,
        };
        const url = '/api/password';
        const successHandler = (_: any) => {
            setShowBusy(false);
            setPasswordResult(true);
            setPasswordError(false);
            setCurrentPassword('');
            setNewPassword('');
            setCopyPassword('');
        };
        const errorHandler = (err: Error) => {
            forwardLoginIfUnauthorized(dispatch, err);
            setShowBusy(false);
            setPasswordResult(false);
            setPasswordError(true);
            console.error(err);
        };
        await doPostRequest(url, payload, successHandler, errorHandler);
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
                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                        onChange={(e) => setNewPassword(e.target.value)}
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
                        onChange={(e) => setCopyPassword(e.target.value)}
                    />
                    <Error
                        visible={newPassword !== copyPassword}
                        text={i18n[language].password.errorMatch}
                    />
                </div>
                <Button
                    onClick={doSubmit}
                    disabled={disabled}
                    text={i18n[language].password.button}
                />
                <Busy visible={showBusy} />

                {passwordResult ? (
                    <div className="result">
                        {i18n[language].password.result}
                    </div>
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
