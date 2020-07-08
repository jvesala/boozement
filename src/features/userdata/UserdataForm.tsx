import React, { useEffect, useState } from 'react';

import './UserdataForm.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage, selectUsername } from '../login/loginSlice';
import { Busy } from '../../components/Busy';
import {
    selectGender,
    selectWeight,
    updateWeight,
    userDataAsync,
} from './userdataSlice';
import { Error } from '../../components/Error';
import { handleFieldUpdate, updateValidity } from '../../app/form';
import { doPutRequest, forwardLoginIfUnauthorized } from '../../app/network';

export const UserdataForm = () => {
    const language: Language = useSelector(selectLanguage);
    const weight = useSelector(selectWeight);
    const gender = useSelector(selectGender);
    const username = useSelector(selectUsername);

    const [showBusy, setShowBusy] = useState(false);
    const [userdataError, setUserdataError] = useState(false);
    const [userdataResult, setUserdataResult] = useState(false);

    const [weightValid, setWeightValid] = useState(true);
    const [disabled, setDisabled] = useState(true);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userDataAsync());
    }, [dispatch]);

    const doSubmit = async () => {
        setDisabled(true);
        setShowBusy(true);
        setUserdataResult(false);

        const payload = {
            weight: weight * 1000,
        };
        const url = '/api/userdata';
        const successHandler = (_: any) => {
            setShowBusy(false);
            setUserdataResult(true);
            setUserdataError(false);
        };
        const errorHandler = (err: any) => {
            forwardLoginIfUnauthorized(dispatch, err);
            console.error(err);
            setShowBusy(false);
            setUserdataResult(false);
            setUserdataError(true);
        };
        await doPutRequest(url, payload, successHandler, errorHandler);
    };

    return (
        <div className="UserdataForm">
            <form
                method="post"
                onChange={(e) => updateValidity(e, setDisabled)}
                onSubmit={(e) => {
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
                        onChange={(e) =>
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
                    disabled={disabled}
                >
                    {i18n[language].userdata.button}
                </button>
                <Busy visible={showBusy} />

                {userdataResult ? (
                    <div>{i18n[language].userdata.result}</div>
                ) : (
                    ''
                )}

                <Error
                    visible={userdataError}
                    text={i18n[language].userdata.error}
                />
            </form>
        </div>
    );
};
