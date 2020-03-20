import React from 'react';
import './Menu.css';
import MenuItem from './MenuItem';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/login/loginSlice';

const title = 'Boozement';

export const Menu = () => {
    const user = useSelector(selectUser);

    return (
        <div className="Menu">
            <header className="Menu-header">
                <nav id="nav">
                    <div className="logo">
                        <h1>{title}</h1>
                    </div>
                    {user ? <MenuItem href={'insert'} title={'Syötä'} /> : ''}
                    {user ? (
                        <MenuItem href={'active'} title={'Nyt juonut'} />
                    ) : (
                        ''
                    )}
                    {user ? (
                        <MenuItem href={'history'} title={'Historia'} />
                    ) : (
                        ''
                    )}
                    {user ? (
                        <MenuItem href={'userdata'} title={'Omat tiedot'} />
                    ) : (
                        ''
                    )}
                </nav>
            </header>
        </div>
    );
};
