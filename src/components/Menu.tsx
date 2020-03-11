import React from 'react';
import './Menu.css';
import MenuItem from './MenuItem';

const title = 'Boozement';

export const Menu = () => {
    return (
        <div className="Menu">
            <header className="Menu-header">
                <nav id="nav">
                    <div className="logo">
                        <h1>{title}</h1>
                    </div>
                    <MenuItem href={'insert'} title={'Syötä'} />
                    <MenuItem href={'active'} title={'Nyt juonut'} />
                    <MenuItem href={'history'} title={'Historia'} />
                    <MenuItem href={'userdata'} title={'Omat tiedot'} />
                </nav>
            </header>
        </div>
    );
};
