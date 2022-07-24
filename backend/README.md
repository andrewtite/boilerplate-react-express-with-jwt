# Boilerplate Express.js Backend

This is a boilerplate for projects requiring:

* backend with JWT Auth.

The authentication and validation servers are run seperatly on seperate ports.

* Project status: development/prototype
* Developed by Andrew Tite

  [andrewtite@gmail.com](mailto:andrewtite@gmail.com&subject=Boilerplate%20Express.js%20Backend)

  [<img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/>](mailto:andrewtite@gmail.com)

## Installation

The installation script will install all dependencies for both the frontend and backend.

To install the required dependencies and get the app running:

1. Clone the <i>parent</i> boilerplate git repo
2. Make sure latest node, npm, and yarn are installed
3. Install required node packages from the command line: `npm install`
4. Create a `.env` file in `./frontend` with the required environment variables. (see example below)
5. Create a `.env` file in `./backend` with the required environment variables. (see example below)
6. Use `database.sql` to create MySQL database tables with default public API username and password.
7. Start the Express.js backend server from the command line: `npm "start backend"`
8. Send GET request to `/api/signinSaltGen` to obtain <u>secret</u> salt
9. Copy the salt you received from `/api/signinSaltGen` to the `ACCESS_TOKEN_SIGNIN_SALT` key
  in the frontend `.env` file.
10. Start the React frontend server from the command line: `npm "start frontend"`

### Environment Variables .env file

Create a `.env` file in backend directory.

   ```
   TOKEN_SERVER_PORT = 5000
   PORT = 5001

   ACCESS_TOKEN_EXPIRY = 50m
   REFRESH_TOKEN_EXPIRY = 60m
   
   DB_HOST = [ENTER_DB_HOST_HERE]
   DB_PORT = [ENTER_DB_PORT_HERE]
   DB_USER = [ENTER_DB_USERNAME_HERE]
   DB_PASSWORD = [ENTER_DB_PASSWORD_HERE]
   DB_DATABASE = [ENTER_DB_NAME_HERE]
   DB_PREFIX = gt_
   
   ACCESS_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`
   REFRESH_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`
   ```

TOKEN_SERVER_PORT = The port you would like the authorization server to run on.

PORT = The port you would like the API server to run on.

DB_HOST = The host of your MySQL database server.

DB_PORT = The port of your MySQL database server. (usually 3306)

DB_USER = Username to access your MySQL database server.

DB_PASSWORD = Password to access your MySQL database server.

DB_DATABASE = The name of the database you would like to use.

DB_PREFIX = If you would like to use a prefix in the table names used in your database, please enter it here.

ACCESS_TOKEN_SECRET = Create a secret string unique to your website used in the generation of access tokens. If you have
multiple servers running, such as in an Autoscaling Group, please ensure this secret is the same on all servers.

REFRESH_TOKEN_SECRET = Create a secret string unique to your website used in the generation of refresh tokens. If you
have multiple servers running, such as in an Autoscaling Group, please ensure this secret is the same on all servers.

### Tips for Creating Your Tokens for .env file

`ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` should be unique to your website.

You can easily generate new tokens from the command line using node:

``` 
$ node
> require("crypto").randomBytes(64).toString("hex")
```

## Usage

You must have both the server ready to go!

To start the Express.js backend server run the command `npm "start backend"`. This will start the Authorization and API
servers on different ports. These can be customized in `./backend/.env` file. <i>(see above)</i>

To start the React frontend server run the command `npm "start frontend"`

## Testing

You see it working using Postman or similar tool used for sending REST API calls. (https://www.postman.com)

Use the API Calls listed below to see your REST API in action.

1. Obtain API Token and Refresh Token from the <b>Auth server</b>.

   `localhost:5000/api/signin`

    <br>
    Request Headers:

    ```
    Content-Type: application/json
    Accept: */*
    Host: localhost:5000
   ```
   <div style="text-align: center; font-size: 13px; font-style: italic;">
   (Replace host and/or port to match where you have the Auth server installed)
   </div>

   <br>

   Request Body (JSON):

    ```
    {
      "user": "my_username",
      "password": "my_password"
    }
   ```

2. Attempt to access posts using API Token from the <b>API Server</b>.

   `localhost:5001/test`

    <br>
    Request Headers:

    ```
    Content-Type: application/json
    Authorization: Bearer [MY_ACCESS_CODE]
    Accept: */*
    Host: localhost:5001
   ```
   <div style="text-align: center; font-size: 13px; font-style: italic;">
   Replace <i>[MY_ACCESS_CODE]</i> a valid <b>Access Code</b> in <b>Authorization</b> after <b>Bearer</b>.<br>
   Replace host and/or port to match where you have the 
   API server installed.
   </div>

5. After 15 minutes API Token will expire.

   Use valid Refresh Token to obtain new API Token and Refresh Token from the <b>Auth server</b>.

   `localhost:5000/refreshToken`

6. After 20 minutes Refresh Token will expire.

   Obtain new API Token and Refresh Token from the <b>Auth server</b>.

   `localhost:5000/login`


5. You can log out the session before the Refresh Token expiry time of 20 minutes using a valid Refresh Token with
   the <b>Auth server</b>.

   `localhost:5000/logout`

# Available API Calls

## Auth Server


### <u>Generate Salt</u>

<p style="font-size:12px; margin-bottom: 5px; border: crimson double 1px;padding:3px;text-align: center;"><strong>
  <strong>!!! IMPORTANT !!!</strong> <br/>
  MUST GENERATE SALT AT LEAST ONCE AFTER FIRST INSTALLING SERVER TO INITIALLY SET REQUIRED ENVIRONMENT VARIABLES THE 
  FRONTEND AND BACKEND BOTH NEED.<br/>
   SEND GET REQUEST TO /api/signinSaltGen THEN COPY THE SALT AND USERNAME<br/>
   TO THE FRONTEND .env FILE
</strong></p>

Used by both frontend and backend APIs for encryption purposes.

When setting up the servers, normally for the first time, you will need to set the `ACCESS_TOKEN_SIGNIN_SALT`
environment variable in the <strong>backend and frontend `.env` files</strong>. This salt is used to securely encrypt
your data being transmitted to the API server.

The good news is, as long as you have a <strong>valid API Access Key</strong>, you will be able to have this done
automatically for you! If you already have the `ACCESS_TOKEN_SIGNIN_SALT` environment variable set at the bottom of
your `.env` file, you can also use this API call to return the current public API username and Salt.

When you successfully make this call, the server will check if it already has a `ACCESS_TOKEN_SIGNIN_SALT` environment
variable. If it does, it will return the current salt and public API username. You will add these values to your
<strong>frontend `.env` file</strong>.

Frontend .env file:
```
REACT_APP_API_USER = "[Public API Username Goes Here]"
REACT_APP_API_PASS = "P@ssw0rd!"
BACKEND_AUTH_URL = "http://localhost:4000"
BACKEND_API_URL = "http://localhost:5000"

ACCESS_TOKEN_SIGNIN_SALT=[Salt Goes Here]
```

If `ACCESS_TOKEN_SIGNIN_SALT` has not been set up, the server will:

* Generate a new salt

* Add the salt to the current backend environment variables

* Add `ACCESS_TOKEN_SIGNIN_SALT` to your `.env` file

  When your server reboots, your new salt will be available auto in the environment variables.

#### Request

`GET /api/signinSaltGen`

Requires valid API Access Key: Yes

    curl -i 
      -H 'Accept: application/json' \
      -H "Connection: keep-alive" \
      -H 'Authorization: Bearer [YOUR API ACCESS KEY GOES HERE]' \
      http://localhost:4000/api/signinSaltGen 

#### Response

    HTTP/1.1 200 OK
    Date: Sun, 24 Jul 2022 12:36:31 GMT
    Status: 200 OK
    ETag: W/"40-l/vfy1OjuXmodDx/+hn4ByGxil4"
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    Content-Length: 64

    {"salt":"$2b$1...sVsIw","username":"api_public_username_from_DB"}

### <u>Generate New API Access Token</u>

Sign in to API Server to get an <strong>Access Token</strong> and <strong>Refresh Token</strong>.

#### Request

`GET /api/signin`

Requires valid API Access Key: No

   ```
   curl --location --request POST 'localhost:5000/api/signin' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "user": "[PUBLIC API USERNAME]",
       "password": "P@ssw0rd!"
   }'
   ```

#### Response

    HTTP/1.1 200 OK
    Date: Sun, 24 Jul 2022 12:36:31 GMT
    Status: 200 OK
    ETag: W/"124-uxvT231SFioTmOlll7M5oq1T95U"
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    Content-Length: 292

    {
      "accessToken":"hcx...HiOg",
      "refreshToken":"hbG...F4e"
    }

### <u>Generate New API Access Token Using Refresh Token</u>

In addition to signing in, you can also use a <strong> valid Refresh Token</strong> to generate a new API Access Token.

Once you have received your NEW API Access Token and Refresh Token, you will now need to use these instead of the ones you were using before. The ones you received during API Sign-In will be invalid after a successful response.

#### Request

`GET /api/refreshToken`

Requires valid API Access Key: No

   ```
   curl --location --request POST 'localhost:5000/api/refreshToken' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "user": "[PUBLIC API USERNAME]",
       "password": "P@ssw0rd!"
   }'
   ```

#### Response

    HTTP/1.1 200 OK
    Date: Sun, 24 Jul 2022 12:36:31 GMT
    Status: 200 OK
    ETag: W/"124-uxvT231SFioTmOlll7M5oq1T95U"
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    Content-Length: 292

    {
      "accessToken":"hcx...HiOg",
      "refreshToken":"hbG...F4e"
    }

### <u>Log out API credentials</u>

Sign out from the API Server to invalidate your current <strong>Access Token</strong> and <strong>Refresh Token</strong>.

#### Request

`GET /api/logout`

Requires valid API Access Key: Yes

   ```
   curl --location --request POST 'localhost:5000/api/logout' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NTg2OTUzMzYsImV4cCI6MTY1ODY5ODMzNn0.2kTU5JFSVxKAj9sPhsOdO12IlTa0bVWI-TqleeoGXdk"
   }'
   ```

#### Response

    HTTP/1.1 200 OK
    Date: Sun, 24 Jul 2022 12:36:31 GMT
    Status: 200 OK
    ETag: W/"124-uxvT231SFioTmOlll7M5oq1T95U"
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    Content-Length: 292

    {}

### <u>Generate New API Access Token</u>

Sign in to API Server to get an <strong>Access Token</strong> and <strong>Refresh Token</strong>.

#### Request

`GET /api/asdfasdfasdfasdfasdfasdf`

Requires valid API Access Key: No

   ```
   curl --location --request POST 'localhost:5000/api/signin' \
   --header 'Content-Type: application/json' \
   --data-raw '{
       "user": "[PUBLIC API USERNAME]",
       "password": "P@ssw0rd!"
   }'
   ```

#### Response

    HTTP/1.1 200 OK
    Date: Sun, 24 Jul 2022 12:36:31 GMT
    Status: 200 OK
    ETag: W/"124-uxvT231SFioTmOlll7M5oq1T95U"
    Connection: keep-alive
    Keep-Alive: timeout=5
    Content-Type: application/json; charset=utf-8
    Content-Length: 292

    {
      "accessToken":"hcx...HiOg",
      "refreshToken":"hbG...F4e"
    }


<hr>

Copyright 2022 Andrew Tite

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
