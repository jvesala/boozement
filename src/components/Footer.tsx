import React from 'react';
import './Footer.css';
import { useDispatch, useSelector } from 'react-redux';
import { i18n, Language } from '../app/localization';
import {
    logoutUserAsync,
    selectLanguage,
    selectUser,
    setLanguage,
} from '../features/login/loginSlice';
import { Button } from './Button';

export const Footer = () => {
    const language: Language = useSelector(selectLanguage);
    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const doLogout = () => {
        dispatch(logoutUserAsync());
    };

    const updateLanguage = (language: Language) => () => {
        dispatch(setLanguage(language));
    };
    return (
        <div className="Footer">
            <footer>
                <div>&copy; Boozement 2020</div>
                {user ? (
                    <div>
                        <button className="flag" onClick={updateLanguage('en')}>
                            {'🇺🇲'}
                        </button>
                        <button className="flag" onClick={updateLanguage('fi')}>
                            {'🇫🇮'}
                        </button>
                        <span className="loggedIn">{user}</span>
                        <Button
                            onClick={doLogout}
                            disabled={false}
                            text={i18n[language].footer.logout}
                        />
                    </div>
                ) : (
                    <div />
                )}
            </footer>
        </div>
    );
};
