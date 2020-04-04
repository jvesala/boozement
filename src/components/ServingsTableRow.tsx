import React from 'react';
import { formatDateTime } from '../app/date';
import { Serving } from '../server/database';

interface ServingsTableRowProps {
    serving: Serving;
}

export const ServingsTableRow: React.FC<ServingsTableRowProps> = ({
    serving
}) => {
    return (
        <tr>
            <td>{formatDateTime(serving.date)}</td>
            <td className="type">{serving.type}</td>
            <td>{serving.amount}</td>
            <td>{serving.units}</td>
        </tr>
    );
};
