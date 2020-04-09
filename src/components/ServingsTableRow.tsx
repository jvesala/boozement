import React from 'react';
import { formatDateTimeWithLanguage } from '../app/date';
import { Language } from '../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';
import { DateTime } from 'luxon';

interface ServingsTableRowProps {
    serving: any;
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

    const onChange = (e: any) => {
        console.log(e.target.value);
    };

    const isCellEditable = (field: string) =>
        selectedCell && selectedCell.id === id && selectedCell.field === field;

    return (
        <tr>
            <td className="date" onClickCapture={handleClick('date')}>
                {isCellEditable('date') ? (
                    <input
                        type="text"
                        defaultValue={formatDateTimeWithLanguage(
                            language,
                            DateTime.fromISO(serving.date)
                        )}
                        onChange={onChange}
                    />
                ) : (
                    formatDateTimeWithLanguage(
                        language,
                        DateTime.fromISO(serving.date)
                    )
                )}
            </td>
            <td className="type" onClickCapture={handleClick('type')}>
                {isCellEditable('type') ? (
                    <input
                        type="text"
                        defaultValue={serving.type}
                        onChange={onChange}
                    />
                ) : (
                    serving.type
                )}
            </td>
            <td className="amount" onClickCapture={handleClick('amount')}>
                {isCellEditable('amount') ? (
                    <input
                        type="text"
                        defaultValue={serving.amount}
                        onChange={onChange}
                    />
                ) : (
                    serving.amount
                )}
            </td>
            <td className="units" onClickCapture={handleClick('units')}>
                {isCellEditable('units') ? (
                    <input
                        type="text"
                        defaultValue={serving.units}
                        onChange={onChange}
                    />
                ) : (
                    serving.units
                )}
            </td>
        </tr>
    );
};
