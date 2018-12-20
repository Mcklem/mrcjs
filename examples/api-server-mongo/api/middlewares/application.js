
exports.logRequest = function(req, res, next) {
    console.log(Date.now() + " - " + req.connection.remoteAddress + " - " + req.originalUrl + " - " + req.method);
    next();
}