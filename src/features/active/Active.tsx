import React from 'react';

import './Active.css';

export const Active = () => {
    return (
        <div className="Active">
            <div id="tab-active-content" className="tab-content">
                <div className="active interval">
                    <p className="inactive hidden">
                        Et ole juonut mitään viimeisen vuorokauden aikana.
                    </p>

                    <p className="statistics hidden">
                        Edellisen 24 tunnin aikana olet juonut{' '}
                        <span className="bac-units" /> annosta. Promillemääräsi
                        on noin <span className="bac" /> &#8240;.
                    </p>

                    <table className="servingstable hidden">
                        <thead>
                            <tr>
                                <th className="date">Kellonaika</th>
                                <th className="servingType">Mitä joit</th>
                                <th className="amount">Tilavuus</th>
                                <th className="units">Annokset</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
