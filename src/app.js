const config = require('./server/config/index');
const kinveyConfig = require('./server/config/kinvey');
const app = require('./server/config/app')();
const data = require('./server/data')(kinveyConfig);
const controllers = require('./server/controllers')({ data });

require('./server/routes')(app, controllers);



app.listen(config.port, () => console.log(`Listening on port :${config.port}`));