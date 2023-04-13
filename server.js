require('dotenv').config();
const http = require('http');

// Database
const { connectDB } = require('./db');
const associateModels = require('./models/associateModels');

// Server
const api = require('./api');
const jobs = require('./utils/jobs');
const Socket = require('./Socket');
const Sockets = require('./Sockets');

// Utils
const initApp = require('./utils/init');
const initIntegrationsApps = require('./utils/init/initIntegrationsApps');
const wipeDb = require('./utils/wipeDb');
const Logger = require('./utils/Logger');
const logger = new Logger();

(async () => {
  const PORT = process.env.PORT || 5005;

  // Init app
  await initApp();
  await connectDB();
  await associateModels();  
  await jobs();

  await wipeDb();

  // Load apps to create/update apps from integrations (Docker, Kubernetes, etc.)
  await initIntegrationsApps();

  // Create server for Express API and WebSockets
  const server = http.createServer();
  server.on('request', api);

  // Register weatherSocket
  const weatherSocket = new Socket(server);
  Sockets.registerSocket('weather', weatherSocket);

  server.listen(PORT, () => {
    logger.log(
      `Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  });
})();
