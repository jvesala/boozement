import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectAmount,
    selectDate,
    selectTime,
    selectType,
    updateDate,
    updateTime,
    updateType,
    updateAmount,
    selectUnits,
    updateUnits
} from './insertSlice';

import './Insert.css';
import { i18n, Language } from '../../app/localization';
import { selectLanguage } from '../login/loginSlice';

export const Insert = () => {
    const language: Language = useSelector(selectLanguage);

    const dispatch = useDispatch();

    const date = useSelector(selectDate);
    const time = useSelector(selectTime);
    const type = useSelector(selectType);
    const amount = useSelector(selectAmount);
    const units = useSelector(selectUnits);

    const [showBusy, setShowBusy] = useState(false);

    const doInsert = () => {
        setShowBusy(true);
        //dispatch(loginUserAsync(email, password));
    };

    return (
        <div className="Insert">
            <form
                method="post"
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
                            onChange={e => dispatch(updateType(e.target.value))}
                        />
                        <div className="clear hidden" />
                        <ul className="type-suggestions-list hidden" />
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
                        onChange={e => dispatch(updateAmount(e.target.value))}
                    />
                    <em className="unit">
                        {i18n[language].insertForm.amountType}
                    </em>
                    <em className="error amount-error hidden">
                        {i18n[language].insertForm.amountError}
                    </em>
                </div>
                <div>
                    <label htmlFor="units">
                        {i18n[language].insertForm.units}
                    </label>
                    <input
                        type="number"
                        name="units"
                        value={units}
                        onChange={e => dispatch(updateUnits(e.target.value))}
                    />
                    <em className="unit">
                        {i18n[language].insertForm.unitsType}
                    </em>
                    <em className="error units-error hidden">
                        {i18n[language].insertForm.unitsError}
                    </em>
                </div>
                <div>
                    <button className="button" type="submit" onClick={doInsert}>
                        {i18n[language].insertForm.button}
                    </button>
                    <div id="error" />
                    <div id="result" />
                    {showBusy ? (
                        <img alt="busy" src="/ajax_indicator.gif" />
                    ) : (
                        ''
                    )}
                </div>
            </form>
        </div>
    );
};
