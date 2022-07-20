# Boilerplate with React Frontend + Express.js Backend

This is a boilerplate for projects requiring:

* a frontend
* backend with JWT Auth.

The authentication and validation servers are run seperatly on seperate ports.

* Project status: development/prototype
* Developed by Andrew Tite

  andrewtite@gmail.com

  [<img src="https://img.shields.io/badge/gmail-%23DD0031.svg?&style=for-the-badge&logo=gmail&logoColor=white"/>](mailto:andrewtite@gmail.com)

## Installation

The installation script will install all dependencies for both the frontend and backend.

To install the required dependencies:

* Clone git repo
* Make sure latest node, npm, and yarn are installed
* From the command line: `npm i`
* Create a `.env` file in `./frontend` with the required environment variables. (see example below)
* Create a `.env` file in `./backend` with the required environment variables. (see example below)

### Environment Variables .env file

#### Frontend

Create a `.env` file in frontend directory.

    PORT=4000

PORT = The port you would like the React frontend to run on.

#### Backend

Create a `.env` file in backend directory.

    TOKEN_SERVER_PORT = 5000
    PORT = 5001
    ACCESS_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`
    REFRESH_TOKEN_SECRET = `USE YOUR OWN TOKEN UNIQUE TO YOUR WEBSITE`

TOKEN_SERVER_PORT = The port you would like the authorization server to run on.

PORT = The port you would like the API server to run on.

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

You must have both the frontend and backend servers running for the application to operate properly.

To start the Express.js backend server run the command `npm "start backend"`. This will start the Authorization and API
servers on different ports. These can be customized in `./backend/.env` file.

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

## Available API Calls

Please see `./backend/README.md` for a list of available API calls you can make to the backend.

<hr>

Copyright 2022 Andrew Tite

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted,
provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
