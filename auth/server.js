'use strict';

const express = require('express');
const basicAuthRoutes = require('./routes/basicAuth.js');
const oauthAuthRoutes = require('./routes/oauthAuth.js');
const bearerAuthRoutes = require('./routes/bearerAuth.js');

const app = express();

app.use(express.json());

app.use(express.static('./public'));

app.use(basicAuthRoutes);
app.use(oauthAuthRoutes);
app.use(bearerAuthRoutes);

module.exports = {
  authServer: app,
  start: port =>
    app.listen(port, () => console.log(`listening on port ${port}`)),
};
