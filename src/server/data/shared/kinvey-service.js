// Inject those
const config = require('../../config/kinvey');
const http = require('../../utils/http-requester');

module.exports = function() {
    function getAuthHeaderForCollection(checkedParam) {
        return checkedParam ?
            config.authHeaders.getAuthHeaderWithUserSession(checkedParam) :
            config.authHeaders.BASIC_AUTH_HEADER_WITH_MASTER_SECRET;
    }

    return {
        getCollection(collectionName, options) {
            let url = config.urls.getCollectionUrl(collectionName, options.filter);

            let authHeader = getAuthHeaderForCollection(options.authToken);

            let headers = {
                [authHeader.name]: authHeader.value
            };

            return http.getJSON(url, { headers });
        },
        postCollection(collectionName, body, options) {
            let url = config.urls.getCollectionUrl(collectionName);

            let authHeader = getAuthHeaderForCollection(options.authToken);
            let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

            let headers = {
                [authHeader.name]: authHeader.value,
                [contentTypeHeader.name]: contentTypeHeader.value
            };

            return http.postJSON(url, JSON.stringify(body), { headers });
        },
        registerUser(user) {
            let url = config.urls.USERS_URL;

            let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_APP_SECRET;
            let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

            let headers = {
                [authHeader.name]: authHeader.value,
                [contentTypeHeader.name]: contentTypeHeader.value
            };

            return http.post(url, JSON.stringify(user), { headers });
        },
        loginUser(user) {
            let url = config.urls.USERS_LOGIN_URL;

            let authHeader = config.authHeaders.BASIC_AUTH_HEADER_WITH_APP_SECRET;
            let contentTypeHeader = config.commonHeaders.CONTENT_TYPE_JSON;

            let headers = {
                [authHeader.name]: authHeader.value,
                [contentTypeHeader.name]: contentTypeHeader.value
            };

            return http.post(url, JSON.stringify(user), { headers });
        }
    };
};