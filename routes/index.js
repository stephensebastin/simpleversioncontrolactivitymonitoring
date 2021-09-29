var branchRoutes = require('./branch');
var userRoutes = require('./users');
var checkinRoutes = require('./push');

module.exports = [].concat(branchRoutes, userRoutes, checkinRoutes);