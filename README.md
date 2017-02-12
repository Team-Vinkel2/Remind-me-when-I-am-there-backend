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
    "user": {
        "username": "username here",
        "password": "password here"
    }
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
	"user": {
		"username": "username here",
		"password": "password here",
		"email": "email here",
		"first_name": "first name here"
	}
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