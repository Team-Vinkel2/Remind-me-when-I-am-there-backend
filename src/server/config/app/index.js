const express = require('express'),
    bodyParser = require('body-parser');


module.exports = function(data) {
    let app = express();

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    return app;
};