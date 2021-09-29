const { logger, accessLogger } = require('./index');

function logRequestDetails(request, returnStatusCode, level) {
    var logJSON = {};
    logJSON["request_url_path"] = request.url.pathname;
    logJSON["remote_ip"] = request.info.remoteAddress;
    logJSON["remote_port"] = request.info.remotePort;
    logJSON["received_at"] = request.info.received;
    logJSON["method"] = request.method;
    logJSON["status_code"] = returnStatusCode;


    // accessLogger.info(`${request.url} ip:${request.info.remoteAddress} port: ${request.info.remotePort}  ${request.info.received}`);
    if (level == 'error') {
        accessLogger.error(logJSON);
    } else {
        accessLogger.info(logJSON);
    }
}
module.exports.logRequestDetails = logRequestDetails;