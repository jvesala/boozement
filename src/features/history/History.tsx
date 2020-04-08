import React, { useEffect } from 'react';

import './History.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import {
    historyServingsAsync,
    selectHistoryLimit,
    selectHistoryOffset,
    selectHistorySearch,
    selectHistoryServings,
    selectHistoryShowBusy,
    setServingsOffset,
    setHistoryEditServing,
    selectHistoryEditServing
} from './historySlice';
import { ServingsTable } from '../../components/ServingsTable';
import { Busy } from '../../components/Busy';

export const History = () => {
    const language: Language = useSelector(selectLanguage);
    const showBusy = useSelector(selectHistoryShowBusy);
    const servings = useSelector(selectHistoryServings);
    const search = useSelector(selectHistorySearch);
    const offset = useSelector(selectHistoryOffset);
    const limit = useSelector(selectHistoryLimit);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(historyServingsAsync(search, offset, limit));
        dispatch(setServingsOffset(0));
    }, []);

    const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOffset = 0;
        historyServingsAsync(e.target.value, newOffset, limit);
        dispatch(setServingsOffset(newOffset));
    };

    return (
        <div className="History">
            <div>
                <input className="search" type="text" name="search" onChange={searchChange} />
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
            <ServingsTable
                servings={servings}
                search={search}
                offset={offset}
                limit={limit}
                updateOffsetFunction={setServingsOffset}
                updateServingsFunction={historyServingsAsync}
                selectHistoryEditServing={selectHistoryEditServing}
                updateEditServingFunction={setHistoryEditServing}
            />
        </div>
    );
};
