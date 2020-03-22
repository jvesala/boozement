import React from 'react';

import './Active.css';
import { i18n, Language } from '../../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../login/loginSlice';
import { selectActiveBac, selectActiveUnits } from './activeSlice';

export const Active = () => {
    const language: Language = useSelector(selectLanguage);

    const activeUnits = useSelector(selectActiveUnits);
    const activeBac = useSelector(selectActiveBac);

    return (
        <div className="Active">
            <div className="active">
                <p className="inactive hidden">
                    {i18n[language].active.inactive}
                </p>

                <p className="statistics hidden">
                    {i18n[language].active.statistics(activeUnits, activeBac)}
                </p>

                <table className="hidden">
                    <thead>
                        <tr>
                            <th className="date">
                                {i18n[language].active.time}
                            </th>
                            <th className="servingType">
                                {i18n[language].active.servingName}
                            </th>
                            <th className="amount">
                                {i18n[language].active.amount}
                            </th>
                            <th className="units">
                                {i18n[language].active.units}
                            </th>
                        </tr>
                    </thead>
                    <tbody />
                </table>
            </div>
        </div>
    );
};
