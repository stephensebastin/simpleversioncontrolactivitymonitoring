var accesslogger = require('../logger/util');
const db = require('../db/util');
const { logger } = require('../logger');
const validateBranch = require('./validator/branch_schema');
//common validation //with loading scripts/json file 
module.exports = [{
        method: 'GET',
        path: '/api/branch/getBranchInfo',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.query;
                var validatedParams = await validateBranch.schema_getBranchInfo.validateAsync(params);

                var branchInfo = await db.getBranchDetails(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (branchInfo != null && branchInfo != undefined) {
                    responseJSON.status = "success";
                    responseJSON.data = branchInfo;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch info not found";
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
        method: 'GET',
        path: '/api/branch/getbrancheslist',
        handler: async function(request, h) {
            var responseJSON = null;
            try {
                var params = request.query;
                var validatedParams = await validateBranch.schema_getBranchesList.validateAsync(params);
                var branchInfo = await db.getAllBranchDetails(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (branchInfo != null && branchInfo != undefined && branchInfo.length > 0) {
                    responseJSON.status = "success";
                    responseJSON.data = branchInfo;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch list is empty";
                    return h.response(responseJSON).code(200);
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
        path: '/api/branch/create',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var value = await validateBranch.schema_create.validateAsync(params);
                var bname = await db.createBranch(value);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (bname != null && bname != undefined) {
                    responseJSON.status = "success";
                    responseJSON.message = "Branch Created Successfully";
                    responseJSON.branchName = bname;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch is not created";
                    return h.response(responseJSON).code(200);
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
        path: '/api/branch/delete',

        handler: async function(request, h) {

            var responseJSON = {};

            try {
                var params = request.payload;
                var value = await validateBranch.schema_delete.validateAsync(params);
                var valueToPass;
                if (value.id != undefined && value.id != null) {
                    valueToPass = value.id;
                    var deleteCount = await db.deleteBranch('id', valueToPass);
                } else if (value.name != undefined) {
                    valueToPass = value.name;
                    var deleteCount = await db.deleteBranch('name', valueToPass);
                }
                /* else {
                                   throw new Error("ID or Name is mandotory");
                               } */
                accesslogger.logRequestDetails(request, 200, 'info');


                if (deleteCount == 0) {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch details not found";
                    logger.info(`User ${value.userId} tried to delete branch with ${valueToPass} :: Branch details not found`);
                    return h.response(responseJSON).code(200);
                }
                responseJSON.status = "success";
                responseJSON.message = "Branch Deleted Successfully";
                logger.info(`User ${params.userId} deleted branch with ${valueToPass} successfully`);
                return h.response(responseJSON);

            } catch (err) {
                var errorStatusCode = 500;
                if (err.isJoi == true) {
                    errorStatusCode = 400;
                }
                accesslogger.logRequestDetails(request, 'error');
                responseJSON.status = "error";
                responseJSON.message = err.message;
                accesslogger.logRequestDetails(request, errorStatusCode, 'error');
                return h.response(responseJSON).code(errorStatusCode);
            }
        }
    },
    {
        method: 'POST',
        path: '/api/branch/pull',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedValue = await validateBranch.schema_pullrequest.validateAsync(params);
                var token = await db.pullBranch(validatedValue);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (token != null && token != undefined) {
                    responseJSON.status = "success";
                    responseJSON.message = "Branch pulled successfully";
                    responseJSON.pullToken = token;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch cannot be pulled";
                    return h.response(responseJSON).code(200);
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
        path: '/api/branch/file/add',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateBranch.schema_addFile.validateAsync(params);
                var bname = await db.createFile(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (bname != null && bname != undefined) {
                    console.log(bname);
                    responseJSON.status = "success";
                    responseJSON.message = "File Added Successfully";
                    responseJSON.branchName = bname;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "File cannot be added";
                    return h.response(responseJSON).code(200);
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
        path: '/api/branch/file/delete',

        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateBranch.schema_deleteFile.validateAsync(params);
                var deleteCount = await db.removeFile(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (deleteCount == 0) {
                    responseJSON.status = "fail";
                    responseJSON.message = "File details not found";
                    return h.response(responseJSON).code(200);
                }
                responseJSON.status = "success";
                responseJSON.message = "File Deleted Successfully";
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
    },
    {
        method: 'GET',
        path: '/api/branch/getfileinfo',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.query;
                var validatedParams = await validateBranch.schema_getFileInfo.validateAsync(params);
                var branchInfo = await db.getFileInfo(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (branchInfo != null && branchInfo != undefined) {
                    responseJSON.status = "success";
                    responseJSON.data = branchInfo;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "File info not found";
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
        method: 'GET',
        path: '/api/branch/getpullrequestsbyuser',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.query;
                var validatedParam = await validateBranch.schema_getPullRequestsByUser.validateAsync(params);
                var pullInfo = await db.getPullRequestsByUser(validatedParam);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (pullInfo != null && pullInfo != undefined) {
                    responseJSON.status = "success";
                    responseJSON.data = pullInfo;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Pull request details  not found";
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
        path: '/api/branch/update',
        handler: async function(request, h) {
            var responseJSON = {};
            try {
                var params = request.payload;
                var validatedParams = await validateBranch.schema_update_branch.validateAsync(params);
                var updateInfo = await db.updateBranchInfo(validatedParams);
                accesslogger.logRequestDetails(request, 200, 'info');
                if (updateInfo != null && updateInfo != undefined && updateInfo > 0) {
                    responseJSON.status = "success";
                    responseJSON.updateCount = updateInfo;
                    return h.response(responseJSON);
                } else {
                    responseJSON.status = "fail";
                    responseJSON.message = "Branch details not updated";
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