# simple-express-csrf

A really simple Express.js CSRF Middleware that just works out of the box.

Are you tired of importing and testing multiple CSRF libraries into Express.js, and
none of them work?
Then this Middleware is for you! Minimal dependencies, educated guess and convetions on
your stack. Depends on other well stablished CSRF lib.



### Install

```sh
$ npm install simple-express-csrtf
```

This module assumes you are using in your project `express`, and `expres-session`.

To install those dependencies run:
```sh
$ npm install express expres-session
```


### TypeScript

This module includes a [TypeScript](https://www.typescriptlang.org/)
declaration file to enable auto complete in compatible editors and type
information for TypeScript projects.


### Importing

From javascript, you can import this with:
```js
const { generate_csrf_token, validateCSRFMiddleware } = require("simple-express-csrf");

// Or

import  { generate_csrf_token, generate_csrf_tokenvalidateCSRFMiddleware } from "simple-express-csrf";
```

From TypeScript, you simply import the middleware like:
```ts
import  { generate_csrf_token, generate_csrf_tokenvalidateCSRFMiddleware } from "simple-express-csrf";
```


## API

### generate_csrf_token(request: Request)
Generates a new CSRF Token, which can be used to be renderd in your form.
It needs the `request` object as an input to use it to save this token and the secret token in the session.


### validate_csrf_token(request: Request)
Reads the `csrf_token` parameter from your `POST` request (the only method secured is `POST`), and verifies it against the secret token in session.


### validateCSRFMiddleware(onErrorCallback: Function)
Automatically validates the CSRF token sent via the `POST` method.
It allows your specified action to be accessed in case the token is valid,
and if not, it calls an `onErrorCallback` callback function that you can use to customize what happens if the token is invalid.


## Example

This is a complete example of how this middleware can be used making use of `ejs`
as a template engine.

```js
// app.js
const express = require("express");

const session = require('express-session');

const { generate_csrf_token, validateCSRFMiddleware } = require("simple-express-csrf")

const app = express();

const port = 4000;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "SECRET_SESION_KEY",
  resave: false,
  saveUninitialized: true,
}));

app.get("/", (req, res) => {
  res.render('index', { csrf_token: generate_csrf_token(req) });
});


app.post("/",
    validateCSRFMiddleware((err, req, res) => {
      return res.redirect("/404");
    }),
  (req, res) => {
  const response = validate_csrf_token(req);
  res.json({"token-is": response});
});
```

This is what the file `views/index.ejs` looks like:
```html
    <form id="myform" action="/" method="post">
        <input type="hidden" name="csrf_token" value="<%= csrf_token %>" />
        <input type="text" name="name" placeholder="Name" />
        <button type="submit">Submit</button>
    </form>
```