import React, { useEffect } from 'react';

import './Active.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import {
    activeServingsAsync,
    selectActiveBac,
    selectActiveServings,
    selectActiveShowBusy,
    selectActiveUnits
} from './activeSlice';
import { ServingsTable } from '../../components/ServingsTable';

export const Active = () => {
    const language: Language = useSelector(selectLanguage);

    const activeUnits = useSelector(selectActiveUnits);
    const activeBac = useSelector(selectActiveBac);
    const showBusy = useSelector(selectActiveShowBusy);
    const servings = useSelector(selectActiveServings);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(activeServingsAsync('24'));
    }, []);

    return (
        <div className="Active">
            <div>
                {!showBusy && servings && servings.length === 0 ? (
                    <p className="inactive">{i18n[language].active.inactive}</p>
                ) : (
                    ''
                )}

                {!showBusy && servings && servings.length > 0 ? (
                    <p className="statistics">
                        {i18n[language].active.statistics(
                            activeUnits,
                            activeBac
                        )}
                    </p>
                ) : (
                    ''
                )}
            </div>

            <ServingsTable
                servings={servings}
                search={''}
                offset={0}
                limit={0}
                updateOffsetFunction={undefined}
                updateServingsFunction={undefined}
                selectHistoryEditServing={undefined}
                updateEditServingFunction={undefined}
            />
        </div>
    );
};
