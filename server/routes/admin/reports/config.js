var Joi = require('joi');
var path = require('path');
var Boom = require('boom');
var pre = require(path.normalize(__dirname + '/pre'));
var db = require(path.normalize(__dirname + '/../../../../db'));

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {POST} /admin/reports/usernotes (Admin) Create User Report Note
  * @apiName CreateUserReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to leave a note on user moderation reports.
  *
  * @apiParam (Payload) {string} report_id The id of the user report to leave the note on
  * @apiParam (Payload) {string} user_id The id of the user leaving the user report note
  * @apiParam (Payload) {string} note The note being left on the user report
  *
  * @apiSuccess {string} id  The unique id for the user report note
  * @apiSuccess {string} report_id The id of the user report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the user report note
  * @apiSuccess {string} username The username of the user who left the user report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the user report note
  * @apiSuccess {string} note The note being left on the user report
  * @apiSuccess {timestamp} created_at Timestamp of when the user report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the user report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error creating the user report note
  */
exports.createUserReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.createUserReportNote' },
  validate: {
    payload: {
      report_id: Joi.string().required(),
      user_id: Joi.string().required(),
      note: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.createUserReportNote(reportNote)
    .then(function(createdReportNote) { reply(createdReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {POST} /admin/reports/postnotes (Admin) Create Post Report Note
  * @apiName CreatePostReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to leave a note on post moderation reports.
  *
  * @apiParam (Payload) {string} report_id The id of the post report to leave the note on
  * @apiParam (Payload) {string} user_id The id of the post leaving the post report note
  * @apiParam (Payload) {string} note The note being left on the post report
  *
  * @apiSuccess {string} id  The unique id for the post report note
  * @apiSuccess {string} report_id The id of the post report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the post report note
  * @apiSuccess {string} username The username of the user who left the post report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the post report note
  * @apiSuccess {string} note The note being left on the post report
  * @apiSuccess {timestamp} created_at Timestamp of when the post report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the post report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error creating the post report note
  */
exports.createPostReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.createPostReportNote' },
  validate: {
    payload: {
      report_id: Joi.string().required(),
      user_id: Joi.string().required(),
      note: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.createPostReportNote(reportNote)
    .then(function(createdReportNote) { reply(createdReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {POST} /admin/reports/messagenotes (Admin) Create Message Report Note
  * @apiName CreateMessageReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to leave a note on message moderation reports.
  *
  * @apiParam (Payload) {string} report_id The id of the message report to leave the note on
  * @apiParam (Payload) {string} user_id The id of the message leaving the message report note
  * @apiParam (Payload) {string} note The note being left on the message report
  *
  * @apiSuccess {string} id The unique id for the message report note
  * @apiSuccess {string} report_id The id of the message report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the message report note
  * @apiSuccess {string} username The username of the user who left the message report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the message report note
  * @apiSuccess {string} note The note being left on the message report
  * @apiSuccess {timestamp} created_at Timestamp of when the message report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the message report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error creating the message report note
  */
exports.createMessageReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.createMessageReportNote' },
  validate: {
    payload: {
      report_id: Joi.string().required(),
      user_id: Joi.string().required(),
      note: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.createMessageReportNote(reportNote)
    .then(function(createdReportNote) { reply(createdReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/users (Admin) Update User Report
  * @apiName UpdateUserReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update the status of a user moderation report.
  *
  * @apiParam (Payload) {string} id The id of the user report note
  * @apiParam (Payload) {string="Pending","Reviewed","Ignored","Bad Report"} status The updated note status
  * @apiParam (Payload) {string} reviewer_user_id The id of the user updating the user report
  *
  * @apiSuccess {string} id The unique id of the user report which was created
  * @apiSuccess {string} status The status of the report
  * @apiSuccess {string} reporter_user_id The unique id of the user initiating the report
  * @apiSuccess {string} reporter_reason The reporter's reason for reporting the offending user
  * @apiSuccess {string} reviewer_user_id The unique id of the user reviewing the report
  * @apiSuccess {string} offender_user_id The unique id of the user being reported
  * @apiSuccess {timestamp} created_at Timestamp of when the user report was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the user report was updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the user report
  */
exports.updateUserReport = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updateUserReport' },
  validate: {
    payload: {
      id: Joi.string().required(),
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report').required(),
      reviewer_user_id: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var report = request.payload;
    db.reports.updateUserReport(report)
    .then(function(updatedReport) { reply(updatedReport); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/posts (Admin) Update Post Report
  * @apiName UpdatePostReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update the status of a post moderation report.
  *
  * @apiParam (Payload) {string} id The id of the post report note
  * @apiParam (Payload) {string="Pending","Reviewed","Ignored","Bad Report"} status The updated note status
  * @apiParam (Payload) {string} reviewer_user_id The id of the user updating the post report
  *
  * @apiSuccess {string} id The unique id of the post report which was created
  * @apiSuccess {string} status The status of the report
  * @apiSuccess {string} reporter_user_id The unique id of the user initiating the report
  * @apiSuccess {string} reporter_reason The reporter's reason for reporting the offending post
  * @apiSuccess {string} reviewer_user_id The unique id of the user reviewing the report
  * @apiSuccess {string} offender_post_id The unique id of the post being reported
  * @apiSuccess {timestamp} created_at Timestamp of when the post report was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the post report was updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the post report
  */
exports.updatePostReport = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updatePostReport' },
  validate: {
    payload: {
      id: Joi.string().required(),
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report').required(),
      reviewer_user_id: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var report = request.payload;
    db.reports.updatePostReport(report)
    .then(function(updatedReport) { reply(updatedReport); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/messages (Admin) Update Message Report
  * @apiName UpdateMessageReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update the status of a message moderation report.
  *
  * @apiParam (Payload) {string} id The id of the message report note
  * @apiParam (Payload) {string="Pending","Reviewed","Ignored","Bad Report"} status The updated note status
  * @apiParam (Payload) {string} reviewer_user_id The id of the user updating the message report
  *
  * @apiSuccess {string} id The unique id of the message report which was created
  * @apiSuccess {string} status The status of the report
  * @apiSuccess {string} reporter_user_id The unique id of the user initiating the report
  * @apiSuccess {string} reporter_reason The reporter's reason for reporting the offending message
  * @apiSuccess {string} reviewer_user_id The unique id of the user reviewing the report
  * @apiSuccess {string} offender_message_id The unique id of the message being reported
  * @apiSuccess {timestamp} created_at Timestamp of when the message report was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the message report was updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the message report
  */
exports.updateMessageReport = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updateMessageReport' },
  validate: {
    payload: {
      id: Joi.string().required(),
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report').required(),
      reviewer_user_id: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var report = request.payload;
    db.reports.updateMessageReport(report)
    .then(function(updatedReport) { reply(updatedReport); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/usernotes (Admin) Update User Report Note
  * @apiName UpdateUserReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update an existing note on user moderation reports.
  *
  * @apiParam (Payload) {string} id The id of the user report note
  * @apiParam (Payload) {string} note The updated note
  *
  * @apiSuccess {string} id  The unique id for the user report note
  * @apiSuccess {string} report_id The id of the user report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the user report note
  * @apiSuccess {string} username The username of the user who left the user report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the user report note
  * @apiSuccess {string} note The note being left on the user report
  * @apiSuccess {timestamp} created_at Timestamp of when the user report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the user report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the user report note
  */
exports.updateUserReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updateUserReportNote' },
  pre: [ { method: pre.canUpdateUserReportNote } ],
  validate: {
    payload: {
      id: Joi.string().required(),
      note: Joi.string()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.updateUserReportNote(reportNote)
    .then(function(updatedReportNote) { reply(updatedReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/usernotes (Admin) Update Post Report Note
  * @apiName UpdatePostReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update an existing note on post moderation reports.
  *
  * @apiParam (Payload) {string} id The id of the post report note
  * @apiParam (Payload) {string} note The updated note
  *
  * @apiSuccess {string} id  The unique id for the post report note
  * @apiSuccess {string} report_id The id of the post report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the post report note
  * @apiSuccess {string} username The username of the user who left the post report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the post report note
  * @apiSuccess {string} note The note being left on the post report
  * @apiSuccess {timestamp} created_at Timestamp of when the post report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the post report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the post report note
  */
exports.updatePostReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updatePostReportNote' },
  pre: [ { method: pre.canUpdatePostReportNote } ],
  validate: {
    payload: {
      id: Joi.string().required(),
      note: Joi.string()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.updatePostReportNote(reportNote)
    .then(function(updatedReportNote) { reply(updatedReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {PUT} /admin/reports/messagenotes (Admin) Update Message Report Note
  * @apiName UpdatePostReportNote
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to update an existing note on message moderation reports.
  *
  * @apiParam (Payload) {string} id The id of the message report note
  * @apiParam (Payload) {string} note The updated note
  *
  * @apiSuccess {string} id  The unique id for the message report note
  * @apiSuccess {string} report_id The id of the message report to leave the note on
  * @apiSuccess {string} user_id The id of the user leaving the message report note
  * @apiSuccess {string} username The username of the user who left the message report note
  * @apiSuccess {string} avatar The url to the avatar of the user who left the message report note
  * @apiSuccess {string} note The note being left on the message report
  * @apiSuccess {timestamp} created_at Timestamp of when the message report note was created
  * @apiSuccess {timestamp} updated_at Timestamp of when the message report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error updating the message report note
  */
exports.updateMessageReportNote = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.updateMessageReportNote' },
  pre: [ { method: pre.canUpdateMessageReportNote } ],
  validate: {
    payload: {
      id: Joi.string().required(),
      note: Joi.string()
    }
  },
  handler: function(request, reply) {
    var reportNote = request.payload;
    db.reports.updateMessageReportNote(reportNote)
    .then(function(updatedReportNote) { reply(updatedReportNote); })
    .catch(function(err) { reply(Boom.badImplementation(err)); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/users (Admin) Page User Report
  * @apiName PageUserReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through user moderation reports.
  *
  * @apiParam (Query) {number} page=1 The page of user reports to retrieve
  * @apiParam (Query) {number} limit=15 The number of user reports to retrieve per page
  * @apiParam (Query) {string="Pending","Reviwed","Ignored","Bad Report"} filter Used to filter reports by their status
  * @apiParam (Query) {string="created_at","priority","reporter_username","offender_username","offender_email","offender_created_at"} field=created_at Indicates which column to sort by, used for table sorting
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  * @apiParam (Query) {string} [search] String used to search for a report by username
  *
  * @apiSuccess {object[]} userReports An array of user reports. Sort order varies depending on the query parameters passed in.
  * @apiSuccess {string} userReports.id The unique id of the user report
  * @apiSuccess {string} userReports.status The status of the user report
  * @apiSuccess {string} userReports.reviewer_user_id The unique id of the user who reviewed the user report
  * @apiSuccess {timestamp} userReports.offender_ban_expiration If the user is banned, the expiration of their ban
  * @apiSuccess {timestamp} userReports.offender_created_at When the offending user created their account
  * @apiSuccess {string} userReports.offender_email The email of the offending user
  * @apiSuccess {string} userReports.offender_user_id The unique id of the offending user
  * @apiSuccess {string} userReports.offender_username The username of the offending user
  * @apiSuccess {string} userReports.reporter_reason The reason for the report
  * @apiSuccess {string} userReports.reporter_user_id The unique id of the reporting user
  * @apiSuccess {string} userReports.reporter_username The username of the reporting user
  * @apiSuccess {timestamp} userReports.created_at Timestamp of when the user report was created
  * @apiSuccess {timestamp} userReports.updated_at Timestamp of when the user report was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the user reports
  */
exports.pageUserReports = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pageUserReports' },
  validate: {
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      filter: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      field: Joi.string().default('created_at').valid('created_at', 'priority', 'reporter_username', 'offender_username', 'offender_email', 'offender_created_at'),
      desc: Joi.boolean().default(false),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var opts = {
      page: request.query.page,
      limit: request.query.limit,
      filter: request.query.filter,
      sortField: request.query.field,
      sortDesc: request.query.desc,
      searchStr: request.query.search
    };
    db.reports.pageUserReports(opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/posts (Admin) Page Post Report
  * @apiName PagePostReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through post moderation reports.
  *
  * @apiParam (Query) {number} page=1 The page of post reports to retrieve
  * @apiParam (Query) {number} limit=15 The number of post reports to retrieve per page
  * @apiParam (Query) {string="Pending","Reviwed","Ignored","Bad Report"} filter Used to filter reports by their status
  * @apiParam (Query) {string="created_at","priority","reporter_username","offender_created_at","offender_title","offender_author_username"} field=created_at Indicates which column to sort by, used for table sorting
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  * @apiParam (Query) {string} [search] String used to search for a report by username
  *
  * @apiSuccess {object[]} postReports An array of post reports. Sort order varies depending on the query parameters passed in.
  * @apiSuccess {string} postReports.id The unique id of the post report
  * @apiSuccess {string} postReports.status The status of the post report
  * @apiSuccess {string} postReports.reviewer_user_id The unique id of the user who reviewed the post report
  * @apiSuccess {timestamp} postReports.offender_ban_expiration If the user is banned, the expiration of their ban
  * @apiSuccess {string} postReports.offender_post_id The unique id of the offending post
  * @apiSuccess {string} postReports.offender_thread_id The unique id of the offending post's thread
  * @apiSuccess {string} postReports.offender_title The title of the offending post
  * @apiSuccess {timestamp} postReports.offender_created_at Timestamp of the offending post was created
  * @apiSuccess {timestamp} postReports.offender_author_created_at Timestamp of the offending post's author created date
  * @apiSuccess {string} postReports.offender_author_username The username of the offending post's author
  * @apiSuccess {string} postReports.offender_author_email The email of the user who created the offending post
  * @apiSuccess {string} postReports.offender_author_id The unique id of the offending post's author
  * @apiSuccess {string} postReports.reporter_reason The reason for the report
  * @apiSuccess {string} postReports.reporter_user_id The unique id of the reporting user
  * @apiSuccess {string} postReports.reporter_username The username of the reporting user
  * @apiSuccess {timestamp} postReports.created_at Timestamp of when the post report was created
  * @apiSuccess {timestamp} postReports.updated_at Timestamp of when the post report was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the post reports
  */
exports.pagePostReports = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pagePostReports' },
  validate: {
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      filter: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      field: Joi.string().default('created_at').valid('created_at', 'priority', 'reporter_username', 'offender_created_at', 'offender_title', 'offender_author_username'),
      desc: Joi.boolean().default(false),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var opts = {
      limit: request.query.limit,
      page: request.query.page,
      filter: request.query.filter,
      sortField: request.query.field,
      sortDesc: request.query.desc,
      searchStr: request.query.search
    };
    db.reports.pagePostReports(opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/messages (Admin) Page Message Report
  * @apiName PagePostReport
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through message moderation reports.
  *
  * @apiParam (Query) {number} page=1 The page of message reports to retrieve
  * @apiParam (Query) {number} limit=15 The number of message reports to retrieve per page
  * @apiParam (Query) {string="Pending","Reviwed","Ignored","Bad Report"} filter Used to filter reports by their status
  * @apiParam (Query) {string="created_at","priority","reporter_username","offender_created_at","offender_author_username"} field=created_at Indicates which column to sort by, used for table sorting
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  * @apiParam (Query) {string} [search] String used to search for a report by username
  *
  * @apiSuccess {object[]} messageReports An array of message reports. Sort order varies depending on the query parameters passed in.
  * @apiSuccess {string} messageReports.id The unique id of the message report
  * @apiSuccess {string} messageReports.status The status of the message report
  * @apiSuccess {string} messageReports.reviewer_user_id The unique id of the user who reviewed the message report
  * @apiSuccess {timestamp} messageReports.offender_ban_expiration If the user is banned, the expiration of their ban
  * @apiSuccess {string} messageReports.offender_message_id The unique id of the offending message
  * @apiSuccess {string} messageReports.offender_message The body of the offending message
  * @apiSuccess {timestamp} messageReports.offender_created_at Timestamp of the offending message was created
  * @apiSuccess {timestamp} messageReports.offender_author_created_at Timestamp of the offending message's author created date
  * @apiSuccess {string} messageReports.offender_author_username The username of the offending message's author
  * @apiSuccess {string} messageReports.offender_author_email The email of the user who created the offending message
  * @apiSuccess {string} messageReports.offender_author_id The unique id of the offending message's author
  * @apiSuccess {string} messageReports.reporter_reason The reason for the report
  * @apiSuccess {string} messageReports.reporter_user_id The unique id of the reporting user
  * @apiSuccess {string} messageReports.reporter_username The username of the reporting user
  * @apiSuccess {timestamp} messageReports.created_at Timestamp of when the message report was created
  * @apiSuccess {timestamp} messageReports.updated_at Timestamp of when the message report was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the message reports
  */
exports.pageMessageReports = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pageMessageReports' },
  validate: {
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      filter: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      field: Joi.string().default('created_at').valid('created_at', 'priority', 'reporter_username', 'offender_created_at', 'offender_author_username'),
      desc: Joi.boolean().default(false),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var opts = {
      limit: request.query.limit,
      page: request.query.page,
      filter: request.query.filter,
      sortField: request.query.field,
      sortDesc: request.query.desc,
      searchStr: request.query.search
    };
    db.reports.pageMessageReports(opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/usernotes/:userReportId (Admin) Page User Report Notes
  * @apiName PageUserReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through user moderation report notes.
  *
  * @apiParam {string} userReportId The unique id of the user report to retrieve notes for
  *
  * @apiParam (Query) {number} page=1 The page of user report notes to retrieve
  * @apiParam (Query) {number} limit=15 The number of user report notes to retrieve per page
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  *
  * @apiSuccess {object[]} userReportNotes An array of user report note objects.
  * @apiSuccess {string} userReportNotes.id The unique id of the user report note
  * @apiSuccess {string} userReportNotes.report_id The unique id of the user report this note is for
  * @apiSuccess {string} userReportNotes.user_id The unique id of the user who left the note
  * @apiSuccess {string} userReportNotes.avatar The URL to the avatar of the user who left the note
  * @apiSuccess {string} userReportNotes.note The note message that was left on the report
  * @apiSuccess {timestamp} userReportNotes.created_at Timestamp of when the report note was created
  * @apiSuccess {timestamp} userReportNotes.updated_at Timestamp of when the report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the user report notes
  */
exports.pageUserReportsNotes = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pageUserReportsNotes' },
  validate: {
    params: { report_id: Joi.string().required() },
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      desc: Joi.boolean().default(false)
    }
  },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    var opts = {
      limit: request.query.limit,
      page: request.query.page,
      sortDesc: request.query.desc
    };

    db.reports.pageUserReportsNotes(reportId, opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/postnotes/:postReportId (Admin) Page Post Report Notes
  * @apiName PagePostReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through post moderation report notes.
  *
  * @apiParam {string} postReportId The unique id of the post report to retrieve notes for
  *
  * @apiParam (Query) {number} page=1 The page of post report notes to retrieve
  * @apiParam (Query) {number} limit=15 The number of post report notes to retrieve per page
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  *
  * @apiSuccess {object[]} postReportNotes An array of post report note objects.
  * @apiSuccess {string} postReportNotes.id The unique id of the post report note
  * @apiSuccess {string} postReportNotes.report_id The unique id of the post report this note is for
  * @apiSuccess {string} postReportNotes.user_id The unique id of the user who left the note
  * @apiSuccess {string} postReportNotes.avatar The URL to the avatar of the user who left the note
  * @apiSuccess {string} postReportNotes.note The note message that was left on the report
  * @apiSuccess {timestamp} postReportNotes.created_at Timestamp of when the report note was created
  * @apiSuccess {timestamp} postReportNotes.updated_at Timestamp of when the report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the post report notes
  */
exports.pagePostReportsNotes = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pagePostReportsNotes' },
  validate: {
    params: { report_id: Joi.string().required() },
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      desc: Joi.boolean().default(false)
    }
  },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    var opts = {
      limit: request.query.limit,
      page: request.query.page,
      sortDesc: request.query.desc
    };
    db.reports.pagePostReportsNotes(reportId, opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/messagenotes/:messageReportId (Admin) Page Message Report Notes
  * @apiName PageMessageReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to page through message moderation report notes.
  *
  * @apiParam {string} messageReportId The unique id of the message report to retrieve notes for
  *
  * @apiParam (Query) {number} page=1 The page of message report notes to retrieve
  * @apiParam (Query) {number} limit=15 The number of message report notes to retrieve per page
  * @apiParam (Query) {boolean} desc=false Boolean indicating whether or not to sort the results in descending order
  *
  * @apiSuccess {object[]} messageReportNotes An array of message report note objects.
  * @apiSuccess {string} messageReportNotes.id The unique id of the message report note
  * @apiSuccess {string} messageReportNotes.report_id The unique id of the message report this note is for
  * @apiSuccess {string} messageReportNotes.user_id The unique id of the user who left the note
  * @apiSuccess {string} messageReportNotes.avatar The URL to the avatar of the user who left the note
  * @apiSuccess {string} messageReportNotes.note The note message that was left on the report
  * @apiSuccess {timestamp} messageReportNotes.created_at Timestamp of when the report note was created
  * @apiSuccess {timestamp} messageReportNotes.updated_at Timestamp of when the report note was last updated
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the message report notes
  */
exports.pageMessageReportsNotes = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.pageMessageReportsNotes' },
  validate: {
    params: { report_id: Joi.string().required() },
    query: {
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(15),
      desc: Joi.boolean().default(false)
    }
  },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    var opts = {
      limit: request.query.limit,
      page: request.query.page,
      sortDesc: request.query.desc
    };
    db.reports.pageMessageReportsNotes(reportId, opts)
    .then(function(reports) { reply(reports); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/users/count (Admin) Count User Reports
  * @apiName CountUserReports
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many user moderation reports there are. This is
  * used to determine how many pages to show for paginating through reports.
  *
  * @apiParam (Query) {string="Pending","Reviewed","Ignored","Bad Report"} [status] The status of the user reports you want a count for
  * @apiParam (Query) {string} [search] Allows user to filter count by their search string
  *
  * @apiSuccess {number} count The number of user reports
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the user report count.
  */
exports.userReportsCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.userReportsCount' },
  validate: {
    query: {
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var status = request.query.status;
    var search = request.query.search;
    var opts;
    if (status || search) {
      opts = {
        status: status,
        searchStr: search
      };
    }
    db.reports.userReportsCount(opts)
    .then(function(count) { reply(count); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/posts/count (Admin) Count Post Reports
  * @apiName CountPostReports
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many post moderation reports there are. This is
  * used to determine how many pages to show for paginating through reports.
  *
  * @apiParam (Query) {string="Pending","Reviewed","Ignored","Bad Report"} [status] The status of the post reports you want a count for
  * @apiParam (Query) {string} [search] Allows user to filter count by their search string
  *
  * @apiSuccess {number} count The number of post reports
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the post report count.
  */
exports.postReportsCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.postReportsCount' },
  validate: {
    query: {
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var status = request.query.status;
    var search = request.query.search;
    var opts;
    if (status || search) {
      opts = {
        status: status,
        searchStr: search
      };
    }
    db.reports.postReportsCount(opts)
    .then(function(count) { reply(count); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/message/count (Admin) Count Message Reports
  * @apiName CountMessageReports
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many message moderation reports there are. This is
  * used to determine how many pages to show for paginating through reports.
  *
  * @apiParam (Query) {string="Pending","Reviewed","Ignored","Bad Report"} [status] The status of the message reports you want a count for
  * @apiParam (Query) {string} [search] Allows user to filter count by their search string
  *
  * @apiSuccess {number} count The number of message reports
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the message report count.
  */
exports.messageReportsCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.messageReportsCount' },
  validate: {
    query: {
      status: Joi.string().valid('Pending', 'Reviewed', 'Ignored', 'Bad Report'),
      search: Joi.string()
    }
  },
  handler: function(request, reply) {
    var status = request.query.status;
    var search = request.query.search;
    var opts;
    if (status || search) {
      opts = {
        status: status,
        searchStr: search
      };
    }
    db.reports.messageReportsCount(opts)
    .then(function(count) { reply(count); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/usernotes/:userReportId/count (Admin) Count User Report Notes
  * @apiName CountUserReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many user moderation report notes there are for a particular report. This is
  * used to determine how many pages to show for paginating through report notes.
  *
  * @apiParam {string} userReportId The unique id of the user report to retrieve notes for
  *
  * @apiSuccess {number} count The number of user report notes for the provided user report id
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the user report notes count.
  */
exports.userReportsNotesCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.userReportsNotesCount' },
  validate: { params: { report_id: Joi.string().required() } },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    db.reports.userReportsNotesCount(reportId)
    .then(function(count) { reply(count); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/postnotes/:postReportId/count (Admin) Count Post Report Notes
  * @apiName CountPostReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many post moderation report notes there are for a particular report. This is
  * used to determine how many pages to show for paginating through report notes.
  *
  * @apiParam {string} postReportId The unique id of the post report to retrieve notes for
  *
  * @apiSuccess {number} count The number of post report notes for the provided post report id
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the post report notes count.
  */
exports.postReportsNotesCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.postReportsNotesCount' },
  validate: { params: { report_id: Joi.string().required() } },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    db.reports.postReportsNotesCount(reportId)
    .then(function(count) { reply(count); });
  }
};

/**
  * @apiVersion 0.3.0
  * @apiGroup Reports
  * @api {GET} /admin/reports/messagenotes/:messageReportId/count (Admin) Count Message Report Notes
  * @apiName CountMessageReportNotes
  * @apiPermission Super Administrator, Administrator, Global Moderator, Moderator
  * @apiDescription Used to count how many message moderation report notes there are for a particular report. This is
  * used to determine how many pages to show for paginating through report notes.
  *
  * @apiParam {string} messageReportId The unique id of the message report to retrieve notes for
  *
  * @apiSuccess {number} count The number of message report notes for the provided message report id
  *
  * @apiError (Error 500) InternalServerError There was an error retrieving the message report notes count.
  */
exports.messageReportsNotesCount = {
  auth: { strategy: 'jwt' },
  plugins: { acls: 'adminReports.messageReportsNotesCount' },
  validate: { params: { report_id: Joi.string().required() } },
  handler: function(request, reply) {
    var reportId = request.params.report_id;
    db.reports.messageReportsNotesCount(reportId)
    .then(function(count) { reply(count); });
  }
};
