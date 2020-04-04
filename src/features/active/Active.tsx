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
import { formatDateTime } from '../../app/date';

export const Active = () => {
    const language: Language = useSelector(selectLanguage);

    const activeUnits = useSelector(selectActiveUnits);
    const activeBac = useSelector(selectActiveBac);
    const showBusy = useSelector(selectActiveShowBusy);
    const servings = useSelector(selectActiveServings);

    const dispatch = useDispatch();

    useEffect(() => {
        console.log('USE EFFECT');
        dispatch(activeServingsAsync(''));
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

            <table className="hidden">
                <thead>
                    <tr>
                        <th className="date">{i18n[language].active.time}</th>
                        <th className="servingType">
                            {i18n[language].active.servingName}
                        </th>
                        <th className="amount">
                            {i18n[language].active.amount}
                        </th>
                        <th className="units">{i18n[language].active.units}</th>
                    </tr>
                </thead>
                <tbody>
                    {servings ? (
                        servings.map((serving: any) => {
                            return (
                                <tr>
                                    <td>{formatDateTime(serving.date)}</td>
                                    <td>{serving.type}</td>
                                    <td>{serving.amount}</td>
                                    <td>{serving.units}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={4} />
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};
