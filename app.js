const monitorOptions = {
  title: 'Express Status',
  theme: 'default.css',
  spans: [
    {
      interval: 0.5,
      retention: 60
    },
    {
      interval: 1,
      retention: 60
    },
    {
      interval: 5,
      retention: 60
    },
    {
      interval: 15,
      retention: 60
    }
  ],
  chartVisibility: {
    cpu: true,
    mem: true,
    load: true,
    eventLoop: true,
    heap: true,
    responseTime: true,
    rps: true,
    statusCodes: true
  },
  ignoreStartsWith: '/admin'
};

const monitor = require('express-status-monitor')(monitorOptions);
const { expressMiddleware, expressRequestIdMiddleware } = require('express-wolox-logger');
const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const config = require('./config');
const routes = require('./app/routes');
const errors = require('./app/middlewares/errors');
const documentation = require('./documentation');
const logger = require('./app/logger');

const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024 * 10;
const DEFAULT_PARAMETER_LIMIT = 10000;

const bodyParserJsonConfig = () => ({
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const bodyParserUrlencodedConfig = () => ({
  extended: true,
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const app = express();

// Client must send "Content-Type: application/json" header
app.use(bodyParser.json(bodyParserJsonConfig()));
app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig()));
app.use(expressRequestIdMiddleware());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(documentation));
app.use(cors());

if (!config.isTesting) app.use(expressMiddleware({ loggerFn: logger.info }));
app.use(monitor);
routes.init(app);

app.use(errors.handle);

module.exports = app;
