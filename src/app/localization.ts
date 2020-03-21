export type Language = 'en' | 'fi';
export type Localisation = typeof en;

export const en = {
    loginForm: {
        logoutMessage: 'You have logged out.',
        title: 'Login',
        email: 'Email',
        password: 'Password',
        button: 'Login'
    }
};

export const fi: Localisation = {
    loginForm: {
        logoutMessage: 'Olet kirjautunut ulos.',
        title: 'Kirjaudu sisään',
        email: 'Sähköpostiosoite',
        password: 'Salasana',
        button: 'Kirjaudu'
    }
};

export const i18n: Record<Language, Localisation> = { en, fi };
