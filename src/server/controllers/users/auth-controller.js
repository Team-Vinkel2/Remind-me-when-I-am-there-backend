module.exports = function(params) {
    let data = params.data;

    return {
        name: 'authController',
        loginUser(req, res) {
            let user = req.body.user;

            data.loginUser(user).then(result => {
                let body = result.response.body;

                return res.status(200).json(body);
            });
        },
        registerUser(req, res) {
            let user = req.body.user;
            data.registerUser(user)
                .then(result => {
                    let createdUser = result.response.body;

                    return Promise.all([data.createRelationshipMapForUser(createdUser), createdUser]);
                })
                .then(result => {
                    let [
                        buddiesResult,
                        createdUser
                    ] = result;

                    let buddies = buddiesResult.response.body.buddies;

                    createdUser.buddies = buddies;
                    return res.status(200).json(createdUser);
                });
        },
        resetPasswordByEmail(req, res) {
            let email = req.body.email;

            data.resetPasswordByEmail(email).then(result => {
                let body = result.response.body;

                return res.status(200).json(body);
            });
        }
    };
};