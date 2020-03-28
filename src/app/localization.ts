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
    footer: {
        logout: 'Log out'
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
        inactive: "You haven't drank anything during previous 24h",
        statistics: (units: string, bac: string) =>
            `During last 24h you've drank <span class="bac-units">${units}</span> units. Your bac is around <span class="bac">${bac}</span> &#8240;.`,
        time: 'Time',
        servingName: 'Serving',
        amount: 'Amount',
        units: 'Units'
    },
    history: {
        hits: 'hits',
        hitUnits: 'units',
        date: 'Date',
        servingName: 'Serving',
        amount: 'Amount',
        units: 'Units'
    },
    userdata: {
        email: 'Email',
        gender: 'Gender',
        weight: 'Weight',
        weightTitle: 'kg',
        weightError: 'Weight must be in kilograms.',
        password: 'Password',
        passwordRetry: 'Password again',
        passwordError: 'Password is mandatory.',
        passwordErrorMismatch: 'Passwords do not match.',
        button: 'Update'
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
    footer: {
        logout: 'Kirjaudu ulos'
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
    },
    history: {
        hits: 'osumaa',
        hitUnits: 'annosta',
        date: 'Päivämäärä',
        servingName: 'Mitä joit',
        amount: 'Tilavuus',
        units: 'Annokset'
    },
    userdata: {
        email: 'Sähköpostiosoite',
        gender: 'Sukupuoli',
        weight: 'Paino',
        weightTitle: 'kg',
        weightError: 'Anna paino kiloissa.',
        password: 'Salasana',
        passwordRetry: 'Salasana uudelleen',
        passwordError: 'Salasana on pakollinen.',
        passwordErrorMismatch: 'Salasana on pakollinen.',
        button: 'Salasana on pakollinen.'
    }
};

export const i18n: Record<Language, Localisation> = { en, fi };
