const config = require('./server/config/index');
const app = require('./server/config/app')();

app.listen(config.port, () => console.log(`Listening on port :${config.port}`));



let shit = [
    'assdasdaasd',
    'assdasdaasd',
    'assdasdaasd',
    'assdasdaasd',
    'assdasdaasd',
    'assdasdaasd'
];
app.get('/shit', (req, res) => {
    res.send(shit);
});