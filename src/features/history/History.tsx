import React from 'react';

import './History.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import { updateSearch } from './historySlice';

export const History = () => {
    const language: Language = useSelector(selectLanguage);

    const dispatch = useDispatch();

    return (
        <div className="History">
            <div>
                <input
                    type="text"
                    name="search"
                    onChange={e => dispatch(updateSearch(e.target.value))}
                />
                <div className="clear" />
                <div className="busy" />
                <div id="summary">
                    <span className="count"></span>{' '}
                    {i18n[language].history.hits} / <br />
                    <span className="units"></span>{' '}
                    {i18n[language].history.hitUnits}
                </div>

                <div id="result" />
                <div id="error" />
                <table>
                    <thead>
                        <th className="date">{i18n[language].history.date}</th>
                        <th className="servingType">
                            {i18n[language].history.servingName}
                        </th>
                        <th className="amount">
                            {i18n[language].history.amount}
                        </th>
                        <th className="units">
                            {i18n[language].history.units}
                        </th>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    );
};
