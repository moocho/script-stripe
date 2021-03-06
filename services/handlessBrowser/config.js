const constants = require('./utils/constants');
const {
    FILLINPUT,
    CLICKELEMENT,
    SUBMITBUTTON,
    SIGNINBUTTON,
    SIGNUPBUTTON,
    EMAILINPUT,
    PASSWORDINPUT,
    FIRSTNAMEINPUT,
    LASTNAMEINPUT,
    MOBILENUMBERINPUT ,
    SIGNINSECTION,
    SIGNUPSECTION,
    ADDRESSSECTION,
    ADDRESSINPUT,
    CREDITCARDSECTION,
    CREDITDEBITCARDNUMBERINPUT,
    CVVNUMBERINPUT,
    EXPIRATIONDATEINPUT,
    MENUSECTION,
    PAYMENTMENUSECTION,
    PYAMENTMETHODADDSECTION,
    POSTALCODEINPUT,
    SAVEADDRESSSECTION,
    CHOOSESTORESECTION
} = constants;
let config = {};

config.antiCaptchaKey = 'a749cdc4bbe02ee9e7ce69fcc8dce800';

config.uberEats = {
    signIn: {
        domFields: [
            {
                action: MOBILENUMBERINPUT,
                sequence: 1,
                domElement: "#useridInput"  ,
                fieldData: '444547971',
            },
            {
                action: PASSWORDINPUT,
                sequence: 2,
                domElement: "#password"  ,
                fieldData: '',
            },
        ],
    }, 
    signUp: {},
    sessionUrl: 'https://auth.uber.com/login/session',
    injectionFileUrl: 'http://localhost:5800/uberSignInInject.js',
    recaptchaSiteKey: '6LdoZSkTAAAAAEyquKnCAeiBngVx1w1DOfML7cix',
};

config.doordash = {
    signIn: {
        domFields: [
            {
                action: CLICKELEMENT,
                name: SIGNINBUTTON,
                section: SIGNINSECTION,
                sequence: 0,
                domElement: ".sc-ugnQR",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: EMAILINPUT,
                section: SIGNINSECTION,
                sequence: 1,
                domElement: "#FieldWrapper-2",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: PASSWORDINPUT,
                section: SIGNINSECTION,
                sequence: 2,
                domElement: "#FieldWrapper-3",
                fieldData: 'mOOcho123**',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: SIGNINSECTION,
                sequence: 3,
                domElement: "#login-submit-button",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: ADDRESSINPUT,
                section: ADDRESSSECTION,
                sequence: 4,
                domElement: ".sc-jUiVId",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: ADDRESSSECTION,
                sequence: 5,
                domElement: ".sc-kecUPG",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: MENUSECTION,
                sequence: 6,
                domElement: "[data-anchor-id='HamburgerMenuButton']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: PAYMENTMENUSECTION,
                sequence: 7,
                domElement: "[data-anchor-id='HamburgerMenuPaymentPageLink']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: PYAMENTMETHODADDSECTION,
                sequence: 8,
                domElement: "[data-anchor-id='PaymentMethodAdd']",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: CREDITDEBITCARDNUMBERINPUT,
                section: CREDITCARDSECTION,
                sequence: 9,
                domElement: "input[name='cardnumber']",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: CVVNUMBERINPUT,
                section: CREDITCARDSECTION,
                sequence: 10,
                domElement: "input[name='cvc']",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: EXPIRATIONDATEINPUT,
                section: CREDITCARDSECTION,
                sequence: 11,
                domElement: "input[name='exp-date']",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: POSTALCODEINPUT,
                section: CREDITCARDSECTION,
                sequence: 12,
                domElement: "input[name='postal']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: CREDITCARDSECTION,
                sequence: 13,
                domElement: ".jaUdGb",
                fieldData: '',
            },
        ],
    }, 
    signUp: {
        domFields: [
            {
                action: CLICKELEMENT,
                name: SIGNUPBUTTON,
                section: SIGNUPSECTION,
                sequence: 1,
                domElement: ".jhbvPi",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: FIRSTNAMEINPUT,
                section: SIGNUPSECTION,
                sequence: 2,
                domElement: "#FieldWrapper-6",
                fieldData: 'Peter',
            },
            {
                action: FILLINPUT,
                name: LASTNAMEINPUT,
                section: SIGNUPSECTION,
                sequence: 3,
                domElement: "#FieldWrapper-7",
                fieldData: 'Roito',
            },
            {
                action: FILLINPUT,
                name: EMAILINPUT,
                section: SIGNUPSECTION,
                sequence: 4,
                domElement: "#FieldWrapper-8",
                fieldData: 'kenri+plus@userlab.co',
            },
            {
                action: FILLINPUT,
                name: MOBILENUMBERINPUT,
                section: SIGNUPSECTION,
                sequence: 5,
                domElement: "#FieldWrapper-10",
                fieldData: '9175085363',
            },
            {
                action: FILLINPUT,
                name: PASSWORDINPUT,
                section: SIGNUPSECTION,
                sequence: 6,
                domElement: "#FieldWrapper-11",
                fieldData: 'Kenri123456',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: SIGNUPSECTION,
                sequence: 7,
                domElement: "#sign-up-submit-button",
                fieldData: '',
            },
        ],
    },
    sessionUrlSignIn: 'https://doordash.7zd4df.net/c/1359847/655830/10350',
    sessionUrlSignUp: 'https://doordash.7zd4df.net/c/1359847/655830/10350',
    injectionFileUrl: '',
    recaptchaSiteKey: '',
};

config.shipt = {
    signIn: {
        domFields: [
            {
                action: CLICKELEMENT,
                name: '',
                section: SIGNINSECTION,
                sequence: 0,
                domElement: "",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: EMAILINPUT,
                section: SIGNINSECTION,
                sequence: 1,
                domElement: "#username",
                fieldData: 'p.roth+shipt@moocho.com',
            },
            {
                action: FILLINPUT,
                name: PASSWORDINPUT,
                section: SIGNINSECTION,
                sequence: 2,
                domElement: "#password",
                fieldData: 'mOOcho123**',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: SIGNINSECTION,
                sequence: 3,
                domElement: "[data-test='LoginForm-log-in-button']",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: ADDRESSINPUT,
                section: ADDRESSSECTION,
                sequence: 4,
                domElement: "[data-test='AddressAutocomplete-input']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: ADDRESSSECTION,
                sequence: 5,
                domElement: "[data-test='AddressAutocomplete-submitButton']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: SAVEADDRESSSECTION,
                sequence: 6,
                domElement: "[data-test='AddressForm-submit-button']",
                fieldData: '',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: CHOOSESTORESECTION,
                sequence: 7,
                domElement: "[data-test='ChooseStore-delivery-store']",
                fieldData: '',
            },
        ],
    }, 
    signUp: {
        domFields: [
            {
                action: '',
                name: '',
                section: SIGNUPSECTION,
                sequence: 1,
                domElement: "",
                fieldData: '',
            },
            {
                action: FILLINPUT,
                name: FIRSTNAMEINPUT,
                section: SIGNUPSECTION,
                sequence: 2,
                domElement: "#full-name",
                fieldData: 'Peter',
            },
            {
                action: FILLINPUT,
                name: EMAILINPUT,
                section: SIGNUPSECTION,
                sequence: 3,
                domElement: "#email",
                fieldData: 'peter_roito@gmail.com',
            },
            {
                action: FILLINPUT,
                name: PASSWORDINPUT,
                section: SIGNUPSECTION,
                sequence: 4,
                domElement: "#password",
                fieldData: 'peterRoito',
            },
            {
                action: CLICKELEMENT,
                name: SUBMITBUTTON,
                section: SIGNUPSECTION,
                sequence: 5,
                domElement: "[data-test='SignupForm-create-account-button']",
                fieldData: '',
            },
        ],
    },
    sessionUrlSignIn: 'https://shop.shipt.com/login',
    sessionUrlSignUp: 'https://shop.shipt.com/signup',
    injectionFileUrl: '',
    recaptchaSiteKey: '',
};

module.exports = config;