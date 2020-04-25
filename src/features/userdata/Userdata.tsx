import React, { useEffect, useState } from 'react';

import './Userdata.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, selectUsername } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import {
    selectGender,
    selectShowUserdataBusy,
    selectWeight,
    updateWeight,
    userDataAsync
} from './userdataSlice';
import { Error } from '../../components/Error';
import { handleFieldUpdate, updateValidity } from '../../app/form';

export const Userdata = () => {
    const language: Language = useSelector(selectLanguage);
    const weight = useSelector(selectWeight);
    const gender = useSelector(selectGender);
    const username = useSelector(selectUsername);
    const showBusy = useSelector(selectShowUserdataBusy);

    const [weightValid, setWeightValid] = useState(true);
    const [disabledUserdata, setDisabledUserData] = useState(true);

    const [disabledPassword, setDisabledPassword] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userDataAsync());
    }, [dispatch]);

    const doSubmit = () => {};

    return (
        <div className="Userdata">
            <form
                method="post"
                onChange={e => updateValidity(e, setDisabledUserData)}
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
                    <input type="text" value={gender} readOnly={true} />
                </div>

                <div>
                    <label htmlFor="weight">
                        {i18n[language].userdata.weight}
                    </label>
                </div>
                <div>
                    <input
                        name="weight"
                        type="number"
                        value={weight}
                        min={1}
                        max={200}
                        step={0.1}
                        required
                        onChange={e =>
                            handleFieldUpdate(
                                e,
                                dispatch,
                                updateWeight,
                                setWeightValid
                            )
                        }
                    />
                    <em className="weightTitle">
                        {i18n[language].userdata.weightTitle}
                    </em>
                    <Error
                        visible={!weightValid}
                        text={i18n[language].userdata.weightError}
                    />
                </div>

                <button
                    className="button"
                    type="submit"
                    onClick={doSubmit}
                    disabled={disabledUserdata}
                >
                    {i18n[language].userdata.button}
                </button>
                <Busy visible={showBusy} />

                <div id="result"></div>
                <div id="error"></div>
            </form>

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
