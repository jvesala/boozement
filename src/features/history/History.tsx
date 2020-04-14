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
    selectHistoryEditServing,
    updateHistorySearch,
    historyUpdateAsync,
    selectHistoryTotalCount,
    selectHistoryTotalUnits
} from './historySlice';
import { ServingsTable } from '../../components/ServingsTable';
import { Busy } from '../../components/Busy';

export const History = () => {
    const language: Language = useSelector(selectLanguage);
    const showBusy = useSelector(selectHistoryShowBusy);
    const servings = useSelector(selectHistoryServings);
    const totalCount = useSelector(selectHistoryTotalCount);
    const totalUnits = useSelector(selectHistoryTotalUnits);
    const search = useSelector(selectHistorySearch);
    const offset = useSelector(selectHistoryOffset);
    const limit = useSelector(selectHistoryLimit);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(historyServingsAsync(search, offset, limit));
    }, [dispatch, limit, offset, search]);

    const searchChange = (_e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateHistorySearch(search));
    };

    return (
        <div className="History">
            <div>
                <input
                    className="search"
                    type="text"
                    name="search"
                    onChange={searchChange}
                />
                <div className="clear" />
                <Busy visible={showBusy} />
                <div id="summary">
                    <span className="count">{totalCount}</span>
                    {i18n[language].history.hits} /
                    <span className="units">{totalUnits}</span>
                    {i18n[language].history.hitUnits}
                </div>
                <div id="error" />
            </div>
            <ServingsTable
                servings={servings}
                offset={offset}
                limit={limit}
                busy={showBusy}
                updateOffsetFunction={setServingsOffset}
                selectHistoryEditServing={selectHistoryEditServing}
                updateEditServingFunction={setHistoryEditServing}
                updateServingFunction={historyUpdateAsync}
            />
        </div>
    );
};
