var helper = {};
module.exports = helper;
var path = require('path');
var uuid = require('node-uuid');
var jwt = require('jsonwebtoken');
var redis = require(path.normalize(__dirname + '/../../../redis'));
var config = require(path.normalize(__dirname + '/../../../config'));
var roles = require(path.normalize(__dirname + '/../../plugins/acls/roles'));

function buildToken(userId, expiration) {
  // build jwt token from decodedToken and privateKey
  var decodedToken = { userId: userId, sessionId: uuid.v4(), timestamp: Date.now() };
  var options = { algorithm: 'HS256', expiresIn: expiration, noTimestamp: true };
  var encodedToken = jwt.sign(decodedToken, config.privateKey, options);
  return { decodedToken: decodedToken, token: encodedToken };
}

function getMaskedPermissions(userRoleNames) {
  var userRoles, mergedRoles = {};

  // Banned overrules all other roles
  if (userRoleNames.indexOf(roles.banned.lookup) > -1) { userRoles = [ roles.banned ]; }
  else { userRoles = userRoleNames.map(function(roleName) { return roles[roleName]; }); }
  userRoles.forEach(function(role) { mergedRoles = mergeRoles(mergedRoles, role); });

  return mergedRoles;
}

function mergeRoles(target, source) {
  var sourceKeys = Object.keys(source);

  sourceKeys.map(function(key) {
    // skip id, name, lookup, description, highlightcolor
    if (key === 'id' ||
        key === 'name' ||
        key === 'lookup' ||
        key === 'description' ||
        key === 'highlightColor') { return; }

    // priorityRestrictions
    if (key === 'priorityRestrictions') {
      if ((!target.priority || target.priority > source.priority) &&
          source.priorityRestrictions &&
          source.priorityRestrictions.length > 0) {
        target.priorityRestrictions = source.priorityRestrictions;
      }
      return;
    }

    // handle priority
    if (key === 'priority' && (!target.priority || target.priority > source.priority)) {
      target.priority = source.priority;
      return;
    }

    // handle permission
    if (typeof source[key] === 'object') {
      target[key] = mergeObjects(target[key], source[key]);
    }
  });

  return target;
}

function mergeObjects(target, source) {
  if (!target) { target = {}; }
  var sourceKeys = Object.keys(source);

  sourceKeys.map(function(key) {
    if (typeof source[key] === 'boolean' && source[key]) { target[key] = source[key]; }

    if (typeof source[key] === 'object') {
      target[key] = mergeObjects(target[key], source[key]);
    }
  });

  return target;
}

function formatUserReply(token, user) {
  var filteredRoles = [];
  user.roles.forEach(function(roleName) {
    if(roles[roleName]) { filteredRoles.push(roleName); }
  });
  if (!filteredRoles.length) { filteredRoles = ['user']; }
  return {
    token: token,
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    roles: filteredRoles,
    moderating: user.moderating,
    permissions: getMaskedPermissions(filteredRoles),
    ban_expiration: user.ban_expiration
  };
}

/**
 * Assumes that the user parameter has
  * id
  * username
  * roles
  * moderating
  * avatar
 */
helper.saveSession = function(user) {
  // build Token
  var tokenResult = buildToken(user.id, user.expiration);
  var decodedToken = tokenResult.decodedToken;
  var token = tokenResult.token;
  user.roles = user.roles.map(function(role) { return role.lookup; });
  // default to user role
  if (!user.roles.length) { user.roles = ['user']; }

  // save username, avatar to redis hash under "user:{userId}"
  var userKey = 'user:' + user.id;
  var userValue = { username: user.username};
  if (user.avatar) { userValue.avatar = user.avatar; }
  return redis.hmsetAsync(userKey, userValue)
  // save roles to redis set under "user:{userId}:roles"
  .then(function() {
    var roleKey = 'user:' + user.id + ':roles';
    return redis.delAsync(roleKey)
    .then(function() { return redis.saddAsync(roleKey, user.roles); });
  })
  // save moderting boards to redis set under "user:{userId}:moderating"
  .then(function() {
    var moderatingKey = 'user:' + user.id + ':moderating';
    return redis.delAsync(moderatingKey)
    .then(function() {
      if (user.moderating && user.moderating.length) {
        return redis.saddAsync(moderatingKey, user.moderating);
      }
    });
  })
  // save session to redis key under "user:{userId}:session:{sessionId}"
  .then(function() {
    var sessionKey = 'user:' + user.id + ':session:' + decodedToken.sessionId;
    return redis.setAsync(sessionKey, decodedToken.timestamp);
  })
  // save user-session to redis set under "user:{userId}:sessions"
  .then(function() {
    var userSessionKey = 'user:' + user.id + ':sessions';
    return redis.saddAsync(userSessionKey, decodedToken.sessionId);
  })
  .then(function() { return formatUserReply(token, user); });
};

helper.updateRoles = function(userId, roles) {
  // pull user role's lookup
  roles = roles || [];
  roles = roles.map(function(role) { return role.lookup; });
  // default to user role
  if (!roles.length) { roles = ['user']; }

  // save roles to redis set under "user:{userId}:roles"
  var roleKey = 'user:' + userId + ':roles';
  return redis.existsAsync(roleKey)
  .then(function(exists) {
    if (exists > 0) {
      return redis.delAsync(roleKey)
      .then(function() { return redis.saddAsync(roleKey, roles); });
    }
  });
};

helper.updateModerating = function(user) {
  // save roles to redis set under "user:{userId}:roles"
  var moderatingKey = 'user:' + user.id + ':moderating';
  return redis.existsAsync(moderatingKey)
  .then(function(exists) {
    if (exists > 0) {
      return redis.delAsync(moderatingKey)
      .then(function() { return redis.saddAsync(moderatingKey, user.moderating); });
    }
  });
};

helper.updateUserInfo = function(user) {
  // save username, avatar to redis hash under "user:{userId}"
  var userKey = 'user:' + user.id;
  // check username for update
  return redis.hexistsAsync(userKey, 'username')
  .then(function(exists) {
    if (exists > 0) {
      return redis.hmsetAsync(userKey, { username: user.username });
    }
  })
  // check avatar for update
  .then(function() {
    return redis.hexistsAsync(userKey, 'avatar')
    .then(function(exists) {
      if (exists > 0 && user.avatar) {
        return redis.hmsetAsync(userKey, { avatar: user.avatar });
      }
      else if (exists === 0 && user.avatar) {
        return redis.hmsetAsync(userKey, { avatar: user.avatar });
      }
      else if (exists > 0 && !user.avatar) {
        return redis.hdelAsync(userKey, 'avatar');
      }
    });
  });
};

helper.deleteSession = function(sessionId, userId) {
  // delete session with key "user:{userId}:session:{sessionId}"
  var sessionKey = 'user:' + userId + ':session:' + sessionId;
  return redis.delAsync(sessionKey)
  // delete session from user with key "user:{userId}:sessions"
  .then(function() {
    var userSessionKey = 'user:' + userId + ':sessions';
    return redis.sremAsync(userSessionKey, sessionId);
  })
  // delete user data if no more sessions
  .then(function() {
    // get user-session listing
    var userSessionKey = 'users:' + userId + ':sessions';
    return redis.smembersAsync(userSessionKey)
    .then(function(setMembers) {
      // no more sessions
      if (setMembers.length < 1) {
        // delete user-sessions set
        return redis.delAsync(userSessionKey)
        // delete user roles
        .then(function() {
          var roleKey = 'user:' + userId + ':roles';
          return redis.delAsync(roleKey);
        })
        // delete user moderating boards
        .then(function() {
          var moderatingKey = 'user:' + userId + ':moderating';
          return redis.delAsync(moderatingKey);
        })
        // delte user info
        .then(function() {
          var userKey = 'user:' + userId;
          return redis.delAsync(userKey);
        });
      }
    });
  });
};

helper.formatUserReply = formatUserReply;
