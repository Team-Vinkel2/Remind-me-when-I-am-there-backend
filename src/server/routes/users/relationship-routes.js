module.exports = function(app, controllers) {
    let relationshipsController = controllers.relationshipsController;
    app
        .post('/send-buddy-request', relationshipsController.sendBuddyRequest)
        .post('/confirm-buddy-request', relationshipsController.confirmBuddyRequest)
        .post('/check-status-between-users', relationshipsController.checkStatusBetweenUsers)
        .get('/my-buddies', relationshipsController.getBuddies)
        .get('/my-buddy-requests', relationshipsController.getBuddyRequests);
};