# Boilerplate web app: Role Based Permissions, Passport local authentication, React, Node.js, Bootstrap, Webpack

Website boilterplate project setup with local passport authentication strategy and role based permissions.

Api routes are authorized with an encrypted JsonWebToken, each api route can be assigned allowable user roles for permissions.

##### Server
* Node.js
* Express 4
* Passport local authentication strategy
	* JsonWebToken
	* Authorized token required for api routes, using middelware authorization check
* MongoDB/Mongoose

##### Client JS
* Webpack 3
	* ESLint
* React 15.6
	* React Router 4 (react-router-dom)
    * Private and Public react routes
* ES6

#### Client Styles
* Bootstrap
* Font Awesome
* Sass

----

#### Configuration

##### Client
* Token expiration setting
  * src/jsx/config/index

```js
/**
 * Set the token expire age in milliseconds.
 */
session: {
	maxAge: 2 * 60 * 60 * 1000 // 2 hours
}
```

##### Shared Client\Server
* Model validations
  * src/shared/model-validations.js

```js
password: {
	minLength: {
		value: 8,
		message: 'Password must be a mininum of 8 characters'
	}
},
email: {
	regex: {
		value: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
		message: 'Email is not valid.'
	}
}
```
* Roles
  * src/shared/roles.js

```js
siteAdmin: 'SiteAdmin',
admin:     'Admin',
user:      'User'
...
```

----

Build the client files dist folder
```sh
# For dev ->
npm run build:dev
# or to watch and build on the fly
npm run watch

# For prod->
npm run build:prod
```

----

Start the server
```sh
npm run start
```

----
### Post Setup

There are three built in roles:
'User' (default), 'Admin' and 'SiteAdmin'

Only the Admin and SiteAdmin can access the User administration tool. The SiteAdmin can edit the users, the Admin role can only view the user list.

To add a SiteAdmin, create a new user account from the /signup page. Then manually update the database, set that user role to 'SiteAdmin'

##### User Admin view. Server-side paging, sortable, search by text filtering.
![alt-text](https://raw.githubusercontent.com/mtimmermann/Boilerplate-Role-Based-Permissions-Nodejs/master/screenshot-user-admin.png "User Admin")


##### License
[MIT](LICENSE)
