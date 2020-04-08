import React from 'react';
import './ServingsTable.css';
import { Serving } from '../server/database';
import { i18n, Language } from '../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';
import { ServingsTableRow } from './ServingsTableRow';

interface ServingsTableProps {
    servings: Serving[];
    search: string;
    offset: number;
    limit: number;
    updateOffsetFunction: any;
    updateServingsFunction: any;
    selectHistoryEditServing: any;
    updateEditServingFunction: any;
}

export const ServingsTable: React.FC<ServingsTableProps> = ({
    servings,
    search,
    offset,
    limit,
    updateOffsetFunction,
    updateServingsFunction,
    selectHistoryEditServing,
    updateEditServingFunction
}) => {
    const language: Language = useSelector(selectLanguage);

    const dispatch = useDispatch();

    const scrollTolerance = 10;

    const scrolled = (e: any) => {
        const scrolledDown =
            e.target.scrollTop + e.target.offsetHeight + scrollTolerance >
            e.target.scrollHeight;
        if (scrolledDown) {
            const newOffset = offset + limit;
            dispatch(updateServingsFunction(search, newOffset, limit));
            dispatch(updateOffsetFunction(newOffset));
        }
    };

    return (
        <table className="ServingsTable" onScroll={scrolled}>
            <thead>
                <tr>
                    <th className="date">
                        {i18n[language].servingsTable.date}
                    </th>
                    <th className="servingType">
                        {i18n[language].servingsTable.servingName}
                    </th>
                    <th className="amount">
                        {i18n[language].servingsTable.amount}
                    </th>
                    <th className="units">
                        {i18n[language].servingsTable.units}
                    </th>
                </tr>
            </thead>
            <tbody>
                {servings ? (
                    servings.map((serving: any) => {
                        return (
                            <ServingsTableRow
                                serving={serving}
                                key={serving.id}
                                id={serving.id}
                                selectHistoryEditServing={
                                    selectHistoryEditServing
                                }
                                updateEditServingFunction={
                                    updateEditServingFunction
                                }
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
