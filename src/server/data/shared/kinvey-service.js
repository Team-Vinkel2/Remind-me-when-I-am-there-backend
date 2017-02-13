// Inject those
// const config = require('../../config/kinvey');
// const http = require('../../utils/http-requester');

module.exports = function(params) {
    let config = params.config;
    let http = params.httpClient;

    function getAuthHeaderForCollection(checkedParam) {
        return checkedParam ?
            config.authHeaders.getAuthHeaderWithUserSession(checkedParam) :
            config.authHeaders.BASIC_AUTH_HEADER_WITH_MASTER_SECRET;
    }

    return {
        getCollection(collectionName, options) {
            return Promise.resolve().then(() => {

                let url = config.urls.getCollectionUrl(collectionName, options ? options.filter : options);

                let authHeader = getAuthHeaderForCollection(options ? options.authToken : options);

                let headers = {
                    [authHeader.name]: authHeader.value
                };

                return http.getJSON(url, { headers });
            });
        },
        postCollection(collectionName, body, options) {
            return Promise.resolve().then(() => {
                let url = config.urls.getCollectionUrl(collectionName, options ? options.filter : options);
                let authHeader = getAuthHeaderForCollection(options ? options.authToken : options);
                let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

                let headers = {
                    [authHeader.name]: authHeader.value,
                    [contentTypeHeader.name]: contentTypeHeader.value
                };

                return http.postJSON(url, body, { headers });
            });
        },
        putCollection(collectionName, body, options) {
            return Promise.resolve().then(() => {
                let url = config.urls.getCollectionUrl(collectionName, options ? options.filter : options);

                let authHeader = getAuthHeaderForCollection(options ? options.authToken : options);
                let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

                let headers = {
                    [authHeader.name]: authHeader.value,
                    [contentTypeHeader.name]: contentTypeHeader.value
                };

                return http.postJSON(url, body, { headers });
            });
        },
        getUsersByFilter(filter) {
            return Promise.resolve().then(() => {
                let url = config.urls.getUsersUrl(filter);

                let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_MASTER_SECRET;

                let headers = {
                    [authHeader.name]: authHeader.value
                };

                return http.getJSON(url, { headers });
            });
        },
        registerUser(user) {
            return Promise.resolve().then(() => {
                let url = config.urls.USERS_URL;

                let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_APP_SECRET;
                let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

                let headers = {
                    [authHeader.name]: authHeader.value,
                    [contentTypeHeader.name]: contentTypeHeader.value
                };

                return http.postJSON(url, user, { headers });
            });
        },
        loginUser(user) {
            return Promise.resolve().then(() => {
                let url = config.urls.USERS_LOGIN_URL;

                let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_APP_SECRET;
                let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

                let headers = {
                    [authHeader.name]: authHeader.value,
                    [contentTypeHeader.name]: contentTypeHeader.value
                };

                return http.postJSON(url, user, { headers });
            });
        },
        resetPasswordByEmail(email) {
            return Promise.resolve().then(() => {
                let url = config.urls.getResetPasswordByEmailUrl(email);

                let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_APP_SECRET;

                let headers = {
                    [authHeader.name]: authHeader.value
                };

                return http.post(url, '', { headers });
            });
        }
    };
};