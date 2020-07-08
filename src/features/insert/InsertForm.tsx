import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './InsertForm.css';
import { i18n, Language } from '../../app/localization';
import { selectLanguage } from '../login/loginSlice';
import {
    createDate,
    createFromUtcString,
    formatDateTime,
} from '../../app/date';
import { Busy } from '../../components/Busy';
import { Error } from '../../components/Error';
import { updateValidity } from '../../app/form';
import { DateTime } from 'luxon';
import {
    doGetRequest,
    doPostRequest,
    forwardLoginIfUnauthorized,
} from '../../app/network';
import { SuggestionsResponse } from '../../server/domain';

export const InsertForm = () => {
    const language: Language = useSelector(selectLanguage);
    const now = DateTime.local();
    const dateNow = now.toISODate();
    const timeNow =
        String(now.hour).padStart(2, '0') +
        ':' +
        String(now.minute).padStart(2, '0');

    const [date, setDate] = useState(dateNow);
    const [time, setTime] = useState(timeNow);
    const [type, setType] = useState('');
    const [suggestions, setSuggestions] = useState([] as SuggestionsResponse);
    const [amount, setAmount] = useState(0);
    const [units, setUnits] = useState(0.0);

    const [showBusy, setShowBusy] = useState(false);
    const [showError, setShowError] = useState(false);
    const [result, setResult] = useState({});

    const [amountValid, setAmountValid] = useState(true);
    const [unitsValid, setUnitsValid] = useState(true);
    const [disabled, setDisabled] = useState(true);

    const dispatch = useDispatch();

    const updateSuggestions = async () => {
        const payload = {
            limit: 10,
            search: type,
        };
        const url = '/api/suggestions';
        const successHandler = (success: SuggestionsResponse) => {
            setSuggestions(success);
        };
        const errorHandler = (err: Error) => {
            forwardLoginIfUnauthorized(dispatch, err);
            console.error(err);
        };
        await doGetRequest(url, payload, successHandler, errorHandler);
    };

    const doInsert = async () => {
        setDisabled(true);
        setShowBusy(true);

        const payload = {
            date: createDate(date, time),
            type,
            amount,
            units,
        };
        const url = '/api/insert';
        const successHandler = (success: any) => {
            setShowBusy(false);
            setAmount(0);
            setUnits(0.0);
            setShowError(false);
            setResult(success.body);
        };
        const errorHandler = (err: any) => {
            forwardLoginIfUnauthorized(dispatch, err);
            console.error(err);
            setShowError(true);
            setResult({});
        };
        await doPostRequest(url, payload, successHandler, errorHandler);
    };

    return (
        <form
            className="InsertForm"
            method="post"
            onChange={(e) => updateValidity(e, setDisabled)}
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <div>
                <h4>{i18n[language].insertForm.title}</h4>
            </div>
            <div>
                <input
                    type="date"
                    name="date"
                    value={date}
                    required
                    onChange={(e) => setDate(e.target.value)}
                />
                <label htmlFor="time">
                    {i18n[language].insertForm.timeLabel}
                </label>
                <input
                    type="time"
                    name="time"
                    value={time}
                    required
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="type">
                    {i18n[language].insertForm.serving}
                </label>
                <div>
                    <input
                        name="type"
                        value={type}
                        required
                        list="suggestionsList"
                        autoComplete="off"
                        onChange={async (e) => {
                            setType(e.target.value);
                            await updateSuggestions();
                        }}
                    />
                    <div className="clear hidden" />
                    <datalist id="suggestionsList">
                        {suggestions?.map((value: any, index: any) => {
                            return <option key={index} value={value.type} />;
                        })}
                    </datalist>
                </div>
            </div>
            <div>
                <label htmlFor="amount">
                    {i18n[language].insertForm.amount}
                </label>
            </div>
            <div>
                <input
                    type="number"
                    name="amount"
                    value={amount}
                    min={1}
                    max={100}
                    step={1}
                    required
                    onChange={(e) => {
                        setAmount(parseInt(e.target.value));
                        const fieldValid =
                            e.target.value.length === 0 ||
                            e.target.validity.valid;
                        setAmountValid(fieldValid);
                    }}
                />
                <em className="unit">{i18n[language].insertForm.amountType}</em>
                <Error
                    visible={!amountValid}
                    text={i18n[language].insertForm.amountError}
                />
            </div>
            <div>
                <label htmlFor="units">{i18n[language].insertForm.units}</label>
            </div>
            <div>
                <input
                    type="number"
                    name="units"
                    value={units}
                    min={0.1}
                    max={5}
                    step={0.1}
                    required
                    onChange={(e) => {
                        setUnits(parseFloat(e.target.value));
                        const fieldValid =
                            e.target.value.length === 0 ||
                            e.target.validity.valid;
                        setUnitsValid(fieldValid);
                    }}
                />
                <em className="unit">{i18n[language].insertForm.unitsType}</em>
                <Error
                    visible={!unitsValid}
                    text={i18n[language].insertForm.unitsError}
                />
            </div>
            <div>
                <button
                    className="button"
                    type="submit"
                    onClick={doInsert}
                    disabled={disabled}
                >
                    {i18n[language].insertForm.button}
                </button>
                <Busy visible={showBusy} />

                {result && (result as any).type && (result as any).date ? (
                    <div>
                        {i18n[language].insertForm.result(
                            (result as any).type,
                            formatDateTime(
                                createFromUtcString((result as any).date)
                            )
                        )}
                    </div>
                ) : (
                    ''
                )}

                <Error
                    visible={showError}
                    text={i18n[language].insertForm.error}
                />
            </div>
        </form>
    );
};
