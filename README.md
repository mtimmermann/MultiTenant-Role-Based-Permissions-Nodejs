# Boilerplate Multi-Tenant web app: Role Based Permissions, Passport local authentication, React, Node.js, Bootstrap, Webpack

Multi-Tenant boiler plate website. Supports multiple client setup, multiple client branding.  Each tenant/client site contains it's own set of users (role: 'User') and admins (role: 'Admin').

The role of 'SiteAdmin' is not associated with any client, and has administration privileges for all clients/companies and all users.

Project setup with local passport authentication strategy and role based permissions.

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

Buld the dist/client-branding folder
```sh
# For dev ->
npm run build:dev:branding
# or to watch and build on the fly
npm run watch:branding

# For prod ->
npm run build:prod:branding
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


#### Setting up Client Sites
Client setup files are located in src/client-branding. There are three simple examples:
src/client-branding
	+ company123/
	+ companyabc/
	+ companyxyz

To add a new client, add a new directory with corresponding index.html and site-branding.scss files

Each client branding directory can be served up by adding /etc/hosts rules to serve up the client directories as subdomains.

Example /etc/hosts setup (for local dev):
```
127.0.0.1 mutlitenant.com
127.0.0.1 CompanyABC.mutlitenant.com
127.0.0.1 CompanyXYZ.mutlitenant.com
127.0.0.1 Company123.mutlitenant.com
```

Client sites must be added to the database using the Company Administration tool when logged in as a SiteAdmin.
![alt-text](https://raw.githubusercontent.com/mtimmermann/Boilerplate-Role-Based-Permissions-Nodejs/master/screenshot-company-admin.png "Company Admin")



##### License
[MIT](LICENSE)
