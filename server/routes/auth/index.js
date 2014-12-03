var path = require('path');
var auth = require(path.join(__dirname, 'config'));

// Export Routes/Pre
module.exports = [
  { method: 'POST', path: '/login', config: auth.login },
  { method: 'DELETE', path: '/logout', config: auth.logout },
  { method: 'POST', path: '/register', config: auth.register },
  { method: 'GET', path: '/register/username/{username}', config: auth.username },
  { method: 'GET', path: '/register/email/{email}', config: auth.email },
  { method: 'GET', path: '/authenticated', config: auth.isAuthenticated },
  { method: 'GET', path: '/recover/{query}', config: auth.recoverAccount },
  { method: 'GET', path: '/reset/{username}/{token}/validate', config: auth.checkResetToken },
  { method: 'POST', path: '/reset', config: auth.resetPassword },
  { method: 'POST', path: '/confirm', config: auth.confirmAccount }
  // { method: 'POST', path: '/refreshToken', config: auth.refreshToken }
];