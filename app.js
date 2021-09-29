const Hapi = require('hapi')
var routes = require('./routes');
var Qs = require('Qs');

var accesslogger = require('./logger/util');
const { logger } = require('./logger');
const db = require('./db/util');

const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    query: {
        parser: (query) => Qs.parse(query)
    }
});

async function initServer() {
    try {
        await server.start();
    } catch (err) {
        logger.error(`Server start Failed ${err.message}`);
        process.exit(1);
    }
    console.log(`Server started and running at ::, ${server.info.uri}`);

}

initServer();
//db.initDB('sync');
db.initDB(null);

server.route(routes);

server.route({
    method: 'GET',
    path: '/',
    handler: async(request, h) => {
        accesslogger.logRequestDetails(request, 500, 'info');

        return '<h3>Welcome to example user activity tracking on version control</h3>';
    }
})