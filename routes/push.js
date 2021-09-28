var accesslogger =  require('../logger/util');
const db = require('../db/util');
const controller =  require('../controller/util');
const validatePush = require('./validator/push_schema');

module.exports = [
    
    {
        method: 'POST',
        path: '/api/push',
        handler: async function  (request, h) {
            accesslogger.logRequestDetails(request,'info');
            var responseJSON = {};
        try {
            var params = request.payload; //pass it as json else need to convert
        
            var validateParams = await validatePush.schema_push_changes.validateAsync(params);            
            
            var token = await controller.processPush(validateParams);
            if(token != null && token != undefined) {
                responseJSON.status = "success";
                responseJSON.message =   "Code pushed successfully";  
                responseJSON.numberOfCommits = token;
                return h.response(responseJSON);
            } else {
                responseJSON.status = "fail";
                responseJSON.message =  "Cannot push right now";         
                return h.response(responseJSON).code(500);
            }
    
        } catch(err) {
            var statusCode=  500;
            if(err.isJoi == true) {
                statusCode = 400;
            }   
            responseJSON.status = "error";
            responseJSON.message =  err.message;         
            accesslogger.logRequestDetails(request,statusCode,'error');
            return h.response(responseJSON).code(statusCode);
        }
        
        },

    },
    {
        method: 'GET',
        path: '/api/branch/getallchangesetsbyuser',
        handler: async function  (request, h) {
            var responseJSON = {};
        try {
            var params= request.query;
            var validatedParams = await validatePush.schema_getallchangesetsbyuser.validateAsync(params);
            var changesetsInfo = await db.getAllChangesetsByUser(validatedParams);
            if(changesetsInfo != null && changesetsInfo != undefined && changesetsInfo.length > 0) {
                responseJSON.status = "success";
                responseJSON.data = changesetsInfo; 
                accesslogger.logRequestDetails(request,200,'info');
                return h.response(responseJSON);
            }   else {
                responseJSON.status = "success";
                responseJSON.message =  "Changesets not found";         
                accesslogger.logRequestDetails(request,200,'info');
                return h.response(responseJSON);
            }
    
        } catch(err) {
            var statusCode=  500;
            if(err.isJoi == true) {
                statusCode = 400;
            }   
            responseJSON.status = "error";
            responseJSON.message =  err.message;         
            accesslogger.logRequestDetails(request,statusCode,'error');
            return h.response(responseJSON).code(statusCode);
        } 
        }
    },
    {
            method: 'GET',
            path: '/api/branch/getchangesetinfo',
            handler: async function  (request, h) {
                var responseJSON = {};
            try {
                var params= request.query;
                var validatedParams = await validatePush.schema_getchangesetinfo.validateAsync(params);
                var branchInfo = await db.getChangestInfo(validatedParams);
                if(branchInfo != null && branchInfo != undefined) {
                    responseJSON.status = "success";
                    responseJSON.data = branchInfo; 
                    accesslogger.logRequestDetails(request,200,'info');
                    return h.response(responseJSON);
                }   else {
                    responseJSON.status = "fail";
                    responseJSON.message =  "Changeset info not found";         
                    accesslogger.logRequestDetails(request,200,'info');
                    return h.response(responseJSON);
                }
        
            } catch(err) {
                var statusCode=  500;
                if(err.isJoi == true) {
                    statusCode = 400;
                }   
                responseJSON.status = "error";
                responseJSON.message =  err.message;         
                accesslogger.logRequestDetails(request,statusCode,'error');
                return h.response(responseJSON).code(statusCode);
            } 
          }
    }
]

