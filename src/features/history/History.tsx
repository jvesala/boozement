import React, { useEffect } from 'react';

import './History.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import {
    historyServingsAsync,
    selectHistoryServings,
    selectHistoryShowBusy
} from './historySlice';
import { ServingsTable } from '../../components/ServingsTable';
import { Busy } from '../../components/Busy';

export const History = () => {
    const language: Language = useSelector(selectLanguage);
    const showBusy = useSelector(selectHistoryShowBusy);
    const servings = useSelector(selectHistoryServings);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(historyServingsAsync(''));
    }, []);

    return (
        <div className="History">
            <div>
                <input
                    type="text"
                    name="search"
                    onChange={e =>
                        dispatch(historyServingsAsync(e.target.value))
                    }
                />
                <div className="clear" />
                <Busy visible={showBusy} />
                <div id="summary">
                    <span className="count"></span>{' '}
                    {i18n[language].history.hits} /
                    <span className="units"></span>{' '}
                    {i18n[language].history.hitUnits}
                </div>
                <div id="error" />
            </div>
            <ServingsTable servings={servings} />
        </div>
    );
};
