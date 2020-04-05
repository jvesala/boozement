import React from 'react';
import { formatDateTimeWithLanguage } from '../app/date';
import { Serving } from '../server/database';
import { Language } from '../app/localization';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';

interface ServingsTableRowProps {
    serving: Serving;
}

export const ServingsTableRow: React.FC<ServingsTableRowProps> = ({
    serving
}) => {
    const language: Language = useSelector(selectLanguage);

    return (
        <tr>
            <td>{formatDateTimeWithLanguage(language, serving.date)}</td>
            <td className="type">{serving.type}</td>
            <td>{serving.amount}</td>
            <td>{serving.units}</td>
        </tr>
    );
};
