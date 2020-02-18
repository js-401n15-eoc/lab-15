'use strict';

const express = require('express');
const router = express.Router();
const basicAuthRoutes = require('./routes/basicAuth.js');
const oauthAuthRoutes = require('./routes/oauthAuth.js');
const bearerAuthRoutes = require('./routes/bearerAuth.js');

router.use(express.json());

router.use(express.static('./public'));

router.use(basicAuthRoutes);
router.use(oauthAuthRoutes);
router.use(bearerAuthRoutes);

// module.exports = {
//   authServer: app,
//   start: port =>
//     app.listen(port, () => console.log(`listening on port ${port}`)),
// };

module.exports = router;
