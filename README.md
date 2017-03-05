# Remind me when I'm there API

This is the backend for our app, RMWIT.

# API routes

## User auth routes

### **/login**, POST
#### Description:

Login an existing user

#### Headers:
    Content-Type: application/json

#### Body:

```javascript
{
    "username": "username here",
    "password": "password here"
}
```
----------

### **/register**, POST
#### Description:

Register a new user

#### Headers:
    Content-Type: application/json

#### Body:
**ALL FIELDS ARE REQUIRED IN ORDER TO REGISTER**
```javascript
{
	"username": "username here",
	"password": "password here",
	"email": "email here",
	"first_name": "first name here"
}
```
----------

### Response:
```javascript
{
	"username": "created user username",
    "email": "created user email",
    "first_name": "created user firstname",
    "email_status": "sent|unknown",
}
```
----------

### **/reset-password**, POST

#### Description:

Reset user password by email

#### Headers:
    Content-Type: application/json

#### Body:

```javascript
{
    "email": "user email here"
}
```
## User relationships routes

### **/send-buddy-request**, POST

#### Description:

Sends a buddy request to user

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who sends the buddy request

#### Body:

```javascript
{
    "username": "the target buddy's username"
}
```

----------

### **/confirm-buddy-request**, POST

#### Description:

Confirm an existing buddy request

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who confirms the buddy request
#### Body:

```javascript
{
    "id": "the id of the buddy request"
}
```