import React from 'react';
import './Footer.css';
import { useDispatch, useSelector } from 'react-redux';
import { i18n, Language } from '../app/localization';
import {
    logoutUserAsync,
    selectLanguage,
    selectUser
} from '../features/login/loginSlice';

export const Footer = () => {
    const language: Language = useSelector(selectLanguage);
    const user = useSelector(selectUser);

    const dispatch = useDispatch();

    const doLogout = () => {
        dispatch(logoutUserAsync());
    };

    return (
        <div className="Footer">
            <footer>
                <div>&copy; Boozement 2020</div>
                {user ? (
                    <div>
                        <span className="loggedIn">{user}</span>
                        <button type="submit" onClick={doLogout}>
                            {i18n[language].footer.logout}
                        </button>
                    </div>
                ) : (
                    <div />
                )}
            </footer>
        </div>
    );
};
