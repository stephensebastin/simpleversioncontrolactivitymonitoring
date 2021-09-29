var accesslogger = require('../logger/util');
const db = require('../db/util');

const validateUser = require('./validator/users_schema');

module.exports = [{
        method: 'POST',
        path: '/api/users/create',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateUser.schema_user_create.validateAsync(params);
                var userId = await db.addUser(validatedParams);

                if (userId != null && userId != undefined) {
                    responseJSON.status = "success";
                    responseJSON.message = "User Created Successfully";
                    responseJSON.userId = userId;
                    accesslogger.logRequestDetails(request, 200, 'info');
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "User is not created";
                    accesslogger.logRequestDetails(request, 500, 'info');
                    return h.response(responseJSON).code(500);
                }
            } catch (err) {
                var statusCode = 500;
                if (err.isJoi == true) {
                    statusCode = 400;
                }
                responseJSON.status = "error";
                responseJSON.message = err.message;
                accesslogger.logRequestDetails(request, statusCode, 'error');
                return h.response(responseJSON).code(statusCode);
            }

        },
        /* options: {
        validate: {
            payload: Joi.object({
                userId: Joi.number().min(1),
            })
        }
    } */

    },
    {
        method: 'POST',
        path: '/api/users/delete',

        handler: async function(request, h) {

            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateUser.schema_user_delete.validateAsync(params);
                var deleteCount = await db.deleteUser(validatedParams.userId);
                if (deleteCount == 0) {
                    responseJSON.status = "fail";
                    responseJSON.message = "User details not found to delete";
                    accesslogger.logRequestDetails(request, 200, 'info');

                    return h.response(responseJSON).code(200);
                }
                responseJSON.status = "success";
                responseJSON.message = "User deleted Successfully";
                accesslogger.logRequestDetails(request, 200, 'info');

                return h.response(responseJSON);

            } catch (err) {
                var statusCode = 500;
                if (err.isJoi == true) {
                    statusCode = 400;
                }
                responseJSON.status = "error";
                responseJSON.message = err.message;
                accesslogger.logRequestDetails(request, statusCode, 'error');
                return h.response(responseJSON).code(statusCode);
            }
        }
    }, {
        method: 'GET',
        path: '/api/users/getInfo',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.query;
                var validatedParams = await validateUser.schema_user_getInfo.validateAsync(params);

                var branchInfo = await db.getUserInfo(validatedParams.userId);
                if (branchInfo != null && branchInfo != undefined) {
                    responseJSON.status = "success";
                    responseJSON.data = branchInfo;
                    accesslogger.logRequestDetails(request, 200, 'info');
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "User Details not found";
                    accesslogger.logRequestDetails(request, 200, 'info');
                    return h.response(responseJSON);
                }

            } catch (err) {
                var statusCode = 500;
                if (err.isJoi == true) {
                    statusCode = 400;
                }
                responseJSON.status = "error";
                responseJSON.message = err.message;
                accesslogger.logRequestDetails(request, statusCode, 'error');
                return h.response(responseJSON).code(statusCode);
            }
        }
    },
    {
        method: 'POST',
        path: '/api/users/update',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateUser.schema_update_user.validateAsync(params);
                var updateInfo = await db.updateUserInfo(validatedParams);
                if (updateInfo != null && updateInfo != undefined && updateInfo > 0) {
                    responseJSON.status = "success";
                    responseJSON.updateCount = updateInfo;
                    accesslogger.logRequestDetails(request, 200, 'info');
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "User details not updated";
                    accesslogger.logRequestDetails(request, 200, 'info');
                    return h.response(responseJSON);
                }

            } catch (err) {
                var statusCode = 500;
                if (err.isJoi == true) {
                    statusCode = 400;
                }
                responseJSON.status = "error";
                responseJSON.message = err.message;
                accesslogger.logRequestDetails(request, statusCode, 'error');
                return h.response(responseJSON).code(statusCode);
            }
        }
    }
]