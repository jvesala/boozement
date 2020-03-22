export type Language = 'en' | 'fi';
export type Localisation = typeof en;

export const en = {
    menu: {
        title: 'Boozement',
        insert: 'Insert',
        active: 'Now',
        history: 'History',
        userdata: 'Userdata'
    },
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
    },
    active: {
        inactive: 'Et ole juonut mitään viimeisen vuorokauden aikana.',
        statistics: (units: string, bac: string) =>
            `Edellisen 24 tunnin aikana olet juonut <span class="bac-units">${units}</span> annosta. Promillemääräsi on noin <span class="bac">${bac}</span> &#8240;.`,
        time: 'Time',
        servingName: 'Serving',
        amount: 'Amount',
        units: 'Units'
    }
};

export const fi: Localisation = {
    menu: {
        title: 'Boozement',
        insert: 'Syötä',
        active: 'Nyt juonut',
        history: 'Historia',
        userdata: 'Omat tiedot'
    },
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
    },
    active: {
        inactive: 'Et ole juonut mitään viimeisen vuorokauden aikana.',
        statistics: (units: string, bac: string) =>
            `Edellisen 24 tunnin aikana olet juonut <span class="bac-units">${units}</span> annosta. Promillemääräsi on noin <span class="bac">${bac}</span> &#8240;.`,
        time: 'Kellonaika',
        servingName: 'Mitä joit',
        amount: 'Tilavuus',
        units: 'Annokset'
    }
};

export const i18n: Record<Language, Localisation> = { en, fi };
