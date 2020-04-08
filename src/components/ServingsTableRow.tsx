import React from 'react';
import { formatDateTimeWithLanguage } from '../app/date';
import { Serving } from '../server/database';
import { Language } from '../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';

interface ServingsTableRowProps {
    serving: Serving;
    id: string;
}

export const ServingsTableRow: React.FC<ServingsTableRowProps> = ({
    serving,
    id
}) => {
    const language: Language = useSelector(selectLanguage);

    const handleClick = (field: string) => (_e: any) => {
        console.log('clicked', id + ':' + field);
    };

    return (
        <tr>
            <td className="date" onClickCapture={handleClick('date')}>
                {formatDateTimeWithLanguage(language, serving.date)}
            </td>
            <td className="type" onClickCapture={handleClick('type')}>
                {serving.type}
            </td>
            <td className="amount" onClickCapture={handleClick('amount')}>
                {serving.amount}
            </td>
            <td className="units" onClickCapture={handleClick('units')}>
                {serving.units}
            </td>
        </tr>
    );
};
