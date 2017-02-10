const fileWalker = require('../utils/file-system-utils').walkDirectorySync;
const kinveyConfig = require('../config/kinvey');
const httpClient = require('../utils/http-requester');

const kinveyService = require('./shared/kinvey-service')({ httpClient, config: kinveyConfig });

module.exports = function(config) {
    // validator?

    let data = {};

    let options = {
        kinveyService,
        config
    };

    fileWalker(__dirname, module => {
        let dataModule = {};
        if (module.includes('-data')) {
            dataModule = require(module)(options);
        }
        Object.keys(dataModule)
            .forEach(key => {
                data[key] = dataModule[key];
            });
    });

    return data;
};