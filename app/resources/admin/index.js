angular.module('ept')
  .factory('AdminReports', require('./reports.js'))
  .factory('AdminSettings', require('./settings.js'))
  .factory('AdminRoles', require('./roles.js'))
  .factory('AdminUsers', require('./users.js'));
