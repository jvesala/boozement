import React from 'react';
import './ServingsTable.css';
import { Serving } from '../server/database';
import { i18n, Language } from '../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';
import { ServingsTableRow } from './ServingsTableRow';

interface ServingsTableProps {
    servings: Serving[];
}

export const ServingsTable: React.FC<ServingsTableProps> = ({ servings }) => {
    const language: Language = useSelector(selectLanguage);

    const scrollTolerance = 10;

    const scrolled = (e: any) => {
        const scrolledDown =
            e.target.scrollTop + e.target.offsetHeight + scrollTolerance >
            e.target.scrollHeight;
        console.log('SCROLLED down', scrolledDown);
    };

    return (
        <table className="ServingsTable" onScroll={scrolled}>
            <thead>
                <tr>
                    <th className="date">{i18n[language].active.time}</th>
                    <th className="servingType">
                        {i18n[language].active.servingName}
                    </th>
                    <th className="amount">{i18n[language].active.amount}</th>
                    <th className="units">{i18n[language].active.units}</th>
                </tr>
            </thead>
            <tbody>
                {servings ? (
                    servings.map((serving: any) => {
                        return (
                            <ServingsTableRow
                                serving={serving}
                                key={serving.id}
                            />
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan={4} />
                    </tr>
                )}
            </tbody>
        </table>
    );
};
