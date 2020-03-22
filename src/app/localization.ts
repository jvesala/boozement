export type Language = 'en' | 'fi';
export type Localisation = typeof en;

export const en = {
    loginForm: {
        logoutMessage: 'You have logged out.',
        title: 'Login',
        email: 'Email',
        password: 'Password',
        button: 'Login'
    },
    insertForm: {
        title: 'Insert serving information',
        timeLabel: 'at',
        serving: 'Serving',
        amount: 'Amount',
        amountType: 'cl',
        amountError: 'Amount size must be between 1-100 cl.',
        units: 'Units',
        unitsError: 'Units size must be between 0.1-5 units.',
        unitsType: 'au',
        button: 'Add serving'
    }
};

export const fi: Localisation = {
    loginForm: {
        logoutMessage: 'Olet kirjautunut ulos.',
        title: 'Kirjaudu sisään',
        email: 'Sähköpostiosoite',
        password: 'Salasana',
        button: 'Kirjaudu'
    },
    insertForm: {
        title: 'Syötä juoman tiedot',
        timeLabel: 'klo',
        serving: 'Mitä joit',
        amount: 'Tilavuus',
        amountType: 'cl',
        amountError: 'Annoskoko on 1-100 cl.',
        units: 'Annokset',
        unitsError: 'Alkoholimäärä 0.1-5 yksikköä.',
        unitsType: 'aa',
        button: 'Lisää annos'
    }
};

export const i18n: Record<Language, Localisation> = { en, fi };
