import React, { useEffect } from 'react';

import './Active.css';
import { i18n, Language } from '../../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import {
    activeServingsAsync,
    activeUpdateAsync,
    selectActiveBac,
    selectActiveEditServing,
    selectActiveServings,
    selectActiveShowBusy,
    selectActiveTotalUnits,
    setActiveEditServing,
} from './activeSlice';
import { ServingsTable } from '../../components/ServingsTable';

export const Active = () => {
    const language: Language = useSelector(selectLanguage);

    const activeBac = useSelector(selectActiveBac);
    const showBusy = useSelector(selectActiveShowBusy);
    const servings = useSelector(selectActiveServings);
    const totalUnits = useSelector(selectActiveTotalUnits);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(activeServingsAsync('24'));
    }, [dispatch]);

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
                            totalUnits,
                            activeBac
                        )}
                    </p>
                ) : (
                    ''
                )}
            </div>

            <ServingsTable
                servings={servings}
                offset={0}
                limit={0}
                busy={false}
                updateOffsetFunction={undefined}
                selectHistoryEditServing={selectActiveEditServing}
                updateEditServingFunction={setActiveEditServing}
                updateServingFunction={activeUpdateAsync}
            />
        </div>
    );
};
