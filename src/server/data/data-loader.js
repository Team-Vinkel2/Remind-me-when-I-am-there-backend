const fileWalker = require('../utils/file-system-utils').walkDirectorySync;


module.exports = function(requester, config) {
    // validator?

    let data = {};

    let options = {
        requester,
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