import React from 'react';
import './Menu.css';
import MenuItem from './MenuItem';
import { useSelector } from 'react-redux';
import { selectLanguage, selectUser } from '../features/login/loginSlice';
import { i18n, Language } from '../app/localization';

export const Menu = () => {
    const language: Language = useSelector(selectLanguage);
    const user = useSelector(selectUser);

    return (
        <div className="Menu">
            <header className="Menu-header">
                <nav id="nav">
                    <div className="logo">
                        <h1>{i18n[language].menu.title}</h1>
                    </div>
                    {user ? (
                        <MenuItem
                            href={'insert'}
                            title={i18n[language].menu.insert}
                        />
                    ) : (
                        ''
                    )}
                    {user ? (
                        <MenuItem
                            href={'active'}
                            title={i18n[language].menu.active}
                        />
                    ) : (
                        ''
                    )}
                    {user ? (
                        <MenuItem
                            href={'history'}
                            title={i18n[language].menu.history}
                        />
                    ) : (
                        ''
                    )}
                    {user ? (
                        <MenuItem
                            href={'userdata'}
                            title={i18n[language].menu.userdata}
                        />
                    ) : (
                        ''
                    )}
                </nav>
            </header>
        </div>
    );
};
