import './Footer.css';
import { useDispatch, useSelector } from 'react-redux';
import { i18n, type Language } from '../app/localization';
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

  const dispatch = useDispatch<any>();

  const doLogout = () => {
    dispatch(logoutUserAsync());
  };

  const updateLanguage = (language: Language) => () => {
    dispatch(setLanguage(language));
  };
  return (
    <div className="Footer">
      <footer>
        <div />
        <div>&copy; Boozement 2021</div>
        <div>
          <button className="flag flagEN" onClick={updateLanguage('en')}>
            {'🇺🇲'}
          </button>
          <button className="flag flagFI" onClick={updateLanguage('fi')}>
            {'🇫🇮'}
          </button>
        </div>
        {user ? (
          <div>
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
        <div />
      </footer>
    </div>
  );
};
