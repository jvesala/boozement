import React from 'react';
import { formatDateTimeWithLanguage } from '../app/date';
import { Serving } from '../server/database';
import { Language } from '../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';

interface ServingsTableRowProps {
    serving: Serving;
    id: string;
    selectHistoryEditServing: any;
    updateEditServingFunction: any;
}

export const ServingsTableRow: React.FC<ServingsTableRowProps> = ({
    serving,
    id,
    selectHistoryEditServing,
    updateEditServingFunction
}) => {
    const language: Language = useSelector(selectLanguage);
    const selectedCell: any = useSelector(selectHistoryEditServing);

    const dispatch = useDispatch();

    const handleClick = (field: string) => (_e: any) => {
        dispatch(
            updateEditServingFunction({
                id,
                field
            })
        );
    };

    const isCellEditable = (field: string) =>
        selectedCell && selectedCell.id === id && selectedCell.field === field;

    return (
        <tr>
            <td className="date" onClickCapture={handleClick('date')}>
                {isCellEditable('date') ? (
                    <input
                        type="text"
                        value={formatDateTimeWithLanguage(
                            language,
                            serving.date
                        )}
                    />
                ) : (
                    formatDateTimeWithLanguage(language, serving.date)
                )}
            </td>
            <td className="type" onClickCapture={handleClick('type')}>
                {isCellEditable('type') ? (
                    <input type="text" value={serving.type} />
                ) : (
                    serving.type
                )}
            </td>
            <td className="amount" onClickCapture={handleClick('amount')}>
                {isCellEditable('amount') ? (
                    <input type="text" value={serving.amount} />
                ) : (
                    serving.amount
                )}
            </td>
            <td className="units" onClickCapture={handleClick('units')}>
                {isCellEditable('units') ? (
                    <input type="text" value={serving.units} />
                ) : (
                    serving.units
                )}
            </td>
        </tr>
    );
};
