const crypto = require('../utils/crypto');

const AUTHORIZATION_HEADER_NAME = 'Authorization';

const kinveyKeys = {
    APP_SECRET: '75aa6ca49f95411d8fa9808720a3118b',
    MASTER_SECRET: 'e71f325d693446b18c9970d5a6a181a7',
    APP_ID: 'kid_SkU9ANLug'
};

const kinveyAuth = {
    BASIC_AUTH_KEY: crypto.encryptToBase64(`${kinveyKeys.APP_ID}:${kinveyKeys.APP_SECRET}`),
    MASTER_AUTH_KEY: crypto.encryptToBase64(`${kinveyKeys.APP_ID}:${kinveyKeys.MASTER_SECRET}`)
};

const urls = {
    BASE_URL: 'https://baas.kinvey.com/',
    COLLECTIONS_URL: '',
    USERS_URL: '',
    USERS_LOGIN_URL: '',
    getResetPasswordByEmailUrl: email => '',
    getUsersUrl: filter => '',
    getCollectionUrl: (collectionName, filter) => ''
};

urls.COLLECTIONS_URL = `${urls.BASE_URL}appdata/${kinveyKeys.APP_ID}/`;
urls.USERS_URL = `${urls.BASE_URL}user/${kinveyKeys.APP_ID}/`;
urls.USERS_LOGIN_URL = `${urls.USERS_URL}login`;

urls.getResetPasswordByEmailUrl = email => {
    let encodedEmail = crypto.encodeURIComponent(email);
    return `${urls.BASE_URL}rpc/${kinveyKeys.APP_ID}/${encodedEmail}/user-password-reset-initiate`;
};

urls.getUsersUrl = filter => {
    return `${urls.USERS_URL}${filter ? '?query=' + filter : ''}`;
};

urls.getCollectionUrl = (collectionName, filter) => {
    return `${urls.COLLECTIONS_URL}${collectionName}/${filter ? '?query=' + filter : ''}`;
};


const authHeaders = {
    BASIC_AUTH_HEADER_WITH_APP_SECRET: {
        name: AUTHORIZATION_HEADER_NAME,
        value: `Basic ${kinveyAuth.BASIC_AUTH_KEY}`
    },
    BASIC_AUTH_HEADER_WITH_MASTER_SECRET: {
        name: AUTHORIZATION_HEADER_NAME,
        value: `Basic ${kinveyAuth.MASTER_AUTH_KEY}`
    },
    getAuthHeaderWithUserSession: authKey => {
        return {
            name: AUTHORIZATION_HEADER_NAME,
            value: `Kinvey ${authKey}`
        };
    }
};

const commonHeaders = {
    CONTENT_TYPE_JSON: {
        name: 'Content-Type',
        value: 'application/json'
    }
};
module.exports = {
    kinveyAuth,
    urls,
    authHeaders,
    commonHeaders
};