const express = require('express');
const path = require('path');
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./server/config');
const logger = require('./server/main/common/logger');

// Connect to the database and load models
require('./server/models').connect(config.dbUri);

const compression = require('compression'); // Compression middleware, compress responses from all routes
const helmet = require('helmet'); // Protect against web vunerablities, http headers, https://www.npmjs.com/package/helmet

const app = express();
const http = require('http').createServer(app);

app.use(compression());
app.use(helmet());

// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


// Use the passport middleware
app.use(passport.initialize());

// load passport strategies
const localSignupStrategy = require('./server/passport/local-signup');
const localLoginStrategy = require('./server/passport/local-login');
passport.use('local-signup', localSignupStrategy);
passport.use('local-login', localLoginStrategy);


// View engine setup
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'pug');


// Define routes
app.use('/auth', require('./server/routes/auth'));
app.use('/api', require('./server/routes/api'));


// Serve static assets normally
// app.use(express.static(path.join(__dirname, '/dist')));

// Serve static assets with file extensions
app.get(/\.(\w+)$/, function (req, res, next) {
  res.sendFile(path.join(__dirname, 'dist', req.path));
});


// Initialize the list of company subdomains
const subdomains = require('./server/main/common/sub-domains');
subdomains.init(app);

// Single page app method for 404s, return the static html file
// Handles all routes so you do not get a not found error
// Serve the subdomain html file
app.get('*', function (req, res, next) {
  const subdomain = subdomains.match(app, req.subdomains);
  if (subdomain) {
    res.sendFile(path.resolve(__dirname, 'dist', `client-branding/${subdomain}/index.html`));
  } else {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  }
});


// Error handler
app.use(function(err, req, res, next) {

  logger.error(err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});


/**
 * Listen on provided port, on all network interfaces.
 */
http.listen(port);
logger.info('Server started on port ' + port);
