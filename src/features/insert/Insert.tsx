import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectDate,
    selectTime,
    selectType,
    updateDate,
    updateTime,
    updateType
} from './insertSlice';

import './Insert.css';

export const Insert = () => {
    const dispatch = useDispatch();

    const date = useSelector(selectDate);
    const time = useSelector(selectTime);
    const type = useSelector(selectType);

    return (
        <div className="Insert">
            <form
                method="post"
                onSubmit={e => {
                    e.preventDefault();
                }}
            >
                <h4>Syötä juoman tiedot</h4>
                <div className="insert-row date">
                    <div className="dateElement">
                        <input
                            type="date"
                            name="date"
                            value={date}
                            onChange={e => dispatch(updateDate(e.target.value))}
                        />
                    </div>
                </div>
                <div className="insert-row time">
                    <label htmlFor="time" className="time">
                        klo
                    </label>
                    <input
                        type="time"
                        name="time"
                        value={time}
                        onChange={e => dispatch(updateTime(e.target.value))}
                    />
                </div>
                <div className="insert-row type">
                    <label htmlFor="type">Mitä joit</label>
                    <div className="inputholder">
                        <input
                            name="type"
                            value={type}
                            onChange={e => dispatch(updateType(e.target.value))}
                        />
                        <div className="clear hidden" id="clear" />
                        <ul className="type-suggestions-list hidden" />
                    </div>
                </div>
                <div className="insert-row amount">
                    <label htmlFor="amount">Tilavuus</label>
                    <input type="number" name="amount" />
                    <em className="unit">cl</em>
                    <em className="error amount-error hidden">
                        Annoskoko on 1-100 cl.
                    </em>
                </div>
                <div className="insert-row units">
                    <label htmlFor="units">Annokset</label>
                    <input type="number" name="units" />
                    <em className="unit">aa</em>
                    <em className="error units-error hidden">
                        Alkoholimäärä 0.1-5 yksikköä
                    </em>
                </div>
                <button
                    className="button fa fa-arrow-circle-right"
                    type="submit"
                    id="submit"
                >
                    Lisää annos
                </button>
                <div className="busy hidden" />
                <div id="result" />
                <div id="error" />
            </form>
        </div>
    );
};
