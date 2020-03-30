import React from 'react';
import './Busy.css';

interface BusyProps {
    visible: boolean;
}

export const Busy: React.FC<BusyProps> = ({ visible }) => {
    return visible ? (
        <img className="busy" alt="busy" src="/ajax_indicator.gif" />
    ) : (
        <div />
    );
};
