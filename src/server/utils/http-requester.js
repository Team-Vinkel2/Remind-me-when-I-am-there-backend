const request = require('request');

function get(url, options) {
    let promise = new Promise((resolve, reject) => {
        let requestHeader = {
            url
        };

        if (options) {
            for (let key in options) {
                if (!options.hasOwnProperty(key)) {
                    continue;
                }
                requestHeader[key] = options[key];
            }
        }
        request(requestHeader, (err, response, body) => {
            if (err) {
                return reject(err);
            }

            resolve({ response, body });
        });
    });
    return promise;
}

function getJSON(url, options) {
    options.json = true;
    return get(url, options);
}

function post(url, body, options) {
    let promise = new Promise((resolve, reject) => {
        let requestHeader = {
            url,
            body
        };

        if (options) {
            for (let key in options) {
                if (!options.hasOwnProperty(key)) {
                    continue;
                }
                requestHeader[key] = options[key];


            }
        }

        request.post(requestHeader, (err, response, responseBody) => {
            if (err) {
                return reject(err);
            }

            resolve({ response, responseBody });
        });
    });
    return promise;

}

function postJSON(url, body, options) {
    options.json = true;
    return post(url, body, options);
}

function put(url, body, options) {
    let promise = new Promise((resolve, reject) => {
        let requestHeader = {
            url,
            body
        };

        if (options) {
            for (let key in options) {
                if (!options.hasOwnProperty(key)) {
                    continue;
                }
                requestHeader[key] = options[key];


            }
        }
        request.put(requestHeader, (err, response, responseBody) => {
            if (err) {
                return reject(err);
            }

            resolve({ response, responseBody });
        });
    });
    return promise;

}

function putJSON(url, body, options) {
    options.json = true;
    return post(url, body, options);
}

function httpDelete(url, options) {
    let promise = new Promise((resolve, reject) => {
        let requestHeader = {
            url
        };

        if (options) {
            for (let key in options) {
                if (!options.hasOwnProperty(key)) {
                    continue;
                }
                requestHeader[key] = options[key];
            }
        }

        request.del(requestHeader, (err, response, responseBody) => {
            if (err) {
                return reject(err);
            }

            resolve({ response, responseBody });
        });
    });
    return promise;
}

function deleteJSON(url, options) {
    options.json = true;
    return httpDelete(url, options);
}

module.exports = {
    get,
    getJSON,
    post,
    postJSON,
    put,
    putJSON,
    httpDelete,
    deleteJSON
};