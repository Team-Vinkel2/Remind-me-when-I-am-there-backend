module.exports = function(params) {
    let data = params.data;

    return {
        name: 'authController',
        loginUser(req, res) {
            let user = req.body.user;
            console.log(user);
            data.loginUser(user).then(result => {
                let body = result.response.body;
                console.log(body);
                return res.status(200).json(body);
            });
        },
        registerUser(req, res) {
            let user = req.body.user;
            console.log(user);

            data.registerUser(user).then(result => {
                let body = result.response.body;
                console.log(body);
                return res.status(200).json(body);
            });
        }
    };
};