const Hapi = require('hapi')
var routes = require('./routes');
var Qs = require('Qs');
var accesslogger = require('./logger/util');
const { logger } = require('./logger');
const db = require('./db/util');
const Path = require('path');


const server = Hapi.server({
    host: 'localhost',
    port: 3000,
    query: {
        parser: (query) => Qs.parse(query)
    },
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        }
    }
});


async function initServer() {
    try {

        await server.start();
        await server.register(require('inert'));

    } catch (err) {
        logger.error(`Server start Failed ${err.message}`);
        process.exit(1);
    }

    logger.info(`Server started and running at ::, ${server.info.uri}`);

}

initServer();
//db.initDB('sync');
db.initDB(null);

server.route(routes);

server.route({
    method: 'GET',
    path: '/',
    handler: async(request, h) => {
        accesslogger.logRequestDetails(request, 200, 'info');
        return h.file('index.html').code(200);
        //  return '<h3>Welcome to example user activity tracking on version control</h3>';
    }
})