import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    insertAsync,
    selectAmount,
    selectDate,
    selectInsertResult,
    selectShowInsertBusy,
    selectShowInsertError,
    selectSuggestions,
    selectTime,
    selectType,
    selectUnits,
    setShowInsertBusy,
    suggestionsAsync,
    updateAmount,
    updateDate,
    updateTime,
    updateType,
    updateUnits
} from './insertSlice';

import './InsertForm.css';
import { i18n, Language } from '../../app/localization';
import { selectLanguage } from '../login/loginSlice';
import {
    createDate,
    createFromUtcString,
    formatDateTime
} from '../../app/date';
import { Busy } from '../../components/Busy';
import { Error } from '../../components/Error';
import { handleFieldUpdate, updateValidity } from '../../app/form';

export const InsertForm = () => {
    const language: Language = useSelector(selectLanguage);

    const dispatch = useDispatch();

    const date = useSelector(selectDate);
    const time = useSelector(selectTime);
    const type = useSelector(selectType);
    const suggestions = useSelector(selectSuggestions);
    const amount = useSelector(selectAmount);
    const units = useSelector(selectUnits);
    const showBusy = useSelector(selectShowInsertBusy);
    const showError = useSelector(selectShowInsertError);
    const insertResult = useSelector(selectInsertResult);

    const [amountValid, setAmountValid] = useState(true);
    const [unitsValid, setUnitsValid] = useState(true);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        const payload = {
            limit: 10,
            search: type
        };
        dispatch(suggestionsAsync(payload));
    }, [dispatch, type]);

    const doInsert = () => {
        setDisabled(true);
        dispatch(setShowInsertBusy(true));

        const payload = {
            date: createDate(date, time),
            type,
            amount,
            units
        };
        dispatch(insertAsync(payload));
    };

    return (
        <form
            className="InsertForm"
            method="post"
            onChange={e => updateValidity(e, setDisabled)}
            onSubmit={e => {
                e.preventDefault();
            }}
        >
            <div>
                <h4>{i18n[language].insertForm.title}</h4>
            </div>
            <div>
                <div>
                    <input
                        type="date"
                        name="date"
                        value={date}
                        required
                        onChange={e => dispatch(updateDate(e.target.value))}
                    />
                </div>
            </div>
            <div>
                <label htmlFor="time">
                    {i18n[language].insertForm.timeLabel}
                </label>
                <input
                    type="time"
                    name="time"
                    value={time}
                    required
                    onChange={e => dispatch(updateTime(e.target.value))}
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
                        onChange={e => dispatch(updateType(e.target.value))}
                    />
                    <div className="clear hidden" />
                    <datalist id="suggestionsList">
                        {suggestions?.map((value: any, index: any) => {
                            return <option key={index} value={value.word} />;
                        })}
                    </datalist>
                </div>
            </div>
            <div>
                <label htmlFor="amount">
                    {i18n[language].insertForm.amount}
                </label>
                <input
                    type="number"
                    name="amount"
                    value={amount}
                    min={1}
                    max={100}
                    step={1}
                    required
                    onChange={e =>
                        handleFieldUpdate(
                            e,
                            dispatch,
                            updateAmount,
                            setAmountValid
                        )
                    }
                />
                <em className="unit">{i18n[language].insertForm.amountType}</em>
                <Error
                    visible={!amountValid}
                    text={i18n[language].insertForm.amountError}
                />
            </div>
            <div>
                <label htmlFor="units">{i18n[language].insertForm.units}</label>
                <input
                    type="number"
                    name="units"
                    value={units}
                    min={0.1}
                    max={5}
                    step={0.1}
                    required
                    onChange={e =>
                        handleFieldUpdate(
                            e,
                            dispatch,
                            updateUnits,
                            setUnitsValid
                        )
                    }
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

                {insertResult ? (
                    <div>
                        {i18n[language].insertForm.result(
                            insertResult.type,
                            formatDateTime(
                                createFromUtcString(insertResult.date)
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
