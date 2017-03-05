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

#### Response

```javascript
{
  "username": "username",
  "email": "user's email",
  "first_name": "firstname",
  "authtoken": "..."
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

#### Response:
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

#### Response
    Status code: 200 OK

----------

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

#### Response:
    Status code: 200 OK

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
#### Response:
    Status code: 200 OK

----------

### **/check-status-between-users**, POST

#### Description:

Check relationship between users

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who runs the check
#### Body:

```javascript
{
    "user_username": "other user"
}
```
#### Response:

##### Several responses available

- No relationship 
```javascript
{
    "status": "unrelated"
}
```

- Buddies
```javascript
{
    "status": "buddies"
}
```

- User who runs the check sent a buddy request
```javascript
{
    "status": "sent",
}
```

- A buddy request was sent to the user who runs the check
```javascript
{
    "status": "received",
    "request_id": "buddy_request_id"
}
```

----------

### **/my-buddies**, GET
#### Description:

Get all friends of a user

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user looks for his buddies

#### Response:
```javascript
[
    "buddy1username",
    "buddy2username",
    ...
]
```

### **/my-buddy-requests**, GET
#### Description:

Get all request to a user

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user looks for his buddy request

#### Response:
```javascript
[
    {
        "_id": "58bc3d4b0b915e693f80b99b",
        "from_id": "58bbff13b155ab64111f199f",
        "from_username": "Bog4242",
        "to_id": "58a0fec7b3ab8b7f1116f8d7",
        "to_username": "Pesho69",
        "_acl": {
            "creator": "kid_SkU9ANLug"
        },
        "_kmd": {
            "lmt": "2017-03-05T16:31:07.953Z",
            "ect": "2017-03-05T16:31:07.953Z"
        }
  },
  ...
]
```

----------

## User query routes

### **/search-users/:partialName**, GET
#### Description:

Search for an user

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who runst the search

#### Response:

```javascript
[
    {
        "username": "username",
        "first_name": "first_name"
    },
    ...
]
```

----------

## Reminder routes

### **/create-reminder-for-buddy**, POST
#### Description:

Create reminder for other user

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who sends the reminder

#### Response:

```javascript
{
    "to_username": "username",
    "title": "Reminder title",
    "content": "Content",
    "date": "07/07/1990 05:08",
    "longitude": 12.3456,
    "latitude": 12.3456,
    "location_name": "Location name"
}
```

----------

### **/my-reminders**, GET
#### Description:

Get all reminders

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who looks for his reminders

#### Response:

```javascript
[
    {
        "from_username": "from username",
        "from_id": "from id",
        "to_username": "to username",
        "to_id": "to id",
        "title": "Reminder title",
        "content": "content",
        "date": "07/07/1990 05:08",
        "longitude": 12.3456,
        "latitude": 12.3456,
        "location_name": "Location name"
        "accepted": false/true,
        "completed": false/true,
        "_id": "58bc27597b1388647f362c4b"
    },
    ...
]
```

----------


### **/my-pending-reminders**, GET
#### Description:

Get pending reminders

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who looks for his unaccepted reminders

#### Response:

```javascript
[
    {
        "from_username": "from username",
        "from_id": "from id",
        "to_username": "to username",
        "to_id": "to id",
        "title": "Reminder title",
        "content": "content",
        "date": "07/07/1990 05:08",
        "longitude": 12.3456,
        "latitude": 12.3456,
        "location_name": "Location name"
        "accepted": false,
        "completed": false/true,
        "_id": "58bc27597b1388647f362c4b"
    },
    ...
]
```

----------

### **/get-reminder/:reminderId**, GET
#### Description:

Get specific reminder

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who looks for his reminder

#### Response:

```javascript
{
    "from_username": "from username",
    "from_id": "from id",
    "to_username": "to username",
    "to_id": "to id",
    "title": "Reminder title",
    "content": "content",
    "date": "07/07/1990 05:08",
    "longitude": 12.3456,
    "latitude": 12.3456,
    "location_name": "Location name"
    "accepted": false/true,
    "completed": false/true,
    "_id": "58bc27597b1388647f362c4b"
}
```

----------

### **/accept-reminder/:reminderId**, PUT
#### Description:

Accept reminder

#### Headers:
    Content-Type: application/json
    auth-token: the auth token of the user who accepts reminder

#### Response:
    Status code: 200 OK

----------
