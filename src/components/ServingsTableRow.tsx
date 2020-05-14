import React from 'react';
import './ServingsTableRow.css';
import { formatDateTimeWithLanguage } from '../app/date';
import { Language } from '../app/localization';
import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage } from '../features/login/loginSlice';
import { DateTime } from 'luxon';
import { selectHistorySearch } from '../features/history/historySlice';

interface ServingsTableRowProps {
    serving: any;
    id: string;
    selectHistoryEditServing: any;
    updateEditServingFunction: any;
    updateServingFunction: any;
}

export const ServingsTableRow: React.FC<ServingsTableRowProps> = ({
    serving,
    id,
    selectHistoryEditServing,
    updateEditServingFunction,
    updateServingFunction,
}) => {
    const language: Language = useSelector(selectLanguage);
    const selectedCell: any = useSelector(selectHistoryEditServing);
    const search: any = useSelector(selectHistorySearch);

    const dispatch = useDispatch();

    const handleClick = (field: string) => (_e: any) => {
        dispatch(
            updateEditServingFunction({
                id,
                field,
            })
        );
    };

    const onKeyup = (e: any) => {
        if (e.keyCode === 13) {
            const payload = {
                id,
                field: e.target.name,
                value: e.target.value,
            };
            dispatch(updateEditServingFunction(undefined));
            dispatch(updateServingFunction(payload));
        }
    };

    const isCellEditable = (field: string) =>
        selectedCell && selectedCell.id === id && selectedCell.field === field;

    const highlight = (value: any) => {
        if (search !== '') {
            const regExp = new RegExp(
                '(' + search.split(' ').join(')|(') + ')',
                'gi'
            );
            const replacement = '<span class="highlight">$&</span>';
            return value.replace(regExp, replacement);
        } else {
            return value;
        }
    };

    const setDate = () => {
        return {
            __html: highlight(
                formatDateTimeWithLanguage(
                    language,
                    DateTime.fromISO(serving.date)
                )
            ),
        };
    };

    const setType = () => {
        return {
            __html: highlight(serving.type),
        };
    };

    return (
        <tr>
            <td className="date" onClickCapture={handleClick('date')}>
                {isCellEditable('date') ? (
                    <input
                        type="text"
                        name="date"
                        defaultValue={DateTime.fromISO(serving.date).toISO()}
                        onKeyUpCapture={onKeyup}
                    />
                ) : (
                    <div dangerouslySetInnerHTML={setDate()} />
                )}
            </td>
            <td className="type" onClickCapture={handleClick('type')}>
                {isCellEditable('type') ? (
                    <input
                        type="text"
                        name="type"
                        defaultValue={serving.type}
                        onKeyUpCapture={onKeyup}
                    />
                ) : (
                    <div dangerouslySetInnerHTML={setType()} />
                )}
            </td>
            <td className="amount" onClickCapture={handleClick('amount')}>
                {isCellEditable('amount') ? (
                    <input
                        type="text"
                        name="amount"
                        defaultValue={serving.amount}
                        onKeyUpCapture={onKeyup}
                    />
                ) : (
                    serving.amount
                )}
            </td>
            <td className="units" onClickCapture={handleClick('units')}>
                {isCellEditable('units') ? (
                    <input
                        type="text"
                        name="units"
                        defaultValue={serving.units}
                        onKeyUpCapture={onKeyup}
                    />
                ) : (
                    serving.units
                )}
            </td>
        </tr>
    );
};
