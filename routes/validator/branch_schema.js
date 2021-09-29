const Joi = require('joi');
const schema_create = Joi.object({
    userId: Joi.number().min(0).required(),
    name: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')).required(),
    description: Joi.string(),
});
module.exports.schema_create = schema_create;

const schema_delete = Joi.object({
    userId: Joi.number().min(0).required(),
    name: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')),
    id: Joi.number().min(0),
}).or('name', 'id');

module.exports.schema_delete = schema_delete;

const schema_pullrequest = Joi.object({
    userId: Joi.number().min(0).required(),
    branchName: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')).required(),
    //    branchId: Joi.number().min(0),
}); //.or('branchName','branchId');

module.exports.schema_pullrequest = schema_pullrequest;


const schema_addFile = Joi.object({
    userId: Joi.number().min(1).required(),
    fileName: Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
    branchId: Joi.number().min(1).required(),

});

module.exports.schema_addFile = schema_addFile;

/*const schema_deleteFile = Joi.object({
    userId: Joi.number().min(1).required(),
    fileName : Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
    branchId: Joi.number().min(1).required(),
});
*/
module.exports.schema_deleteFile = schema_addFile;


const schema_getFileInfo = Joi.object({
    userId: Joi.number().min(1).required(),
    fileName: Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
    branchId: Joi.number().min(1).required(),
});

module.exports.schema_getFileInfo = schema_getFileInfo;


const schema_getPullRequestsByUser = Joi.object({
    userId: Joi.number().min(1).required(),
    // fileName : Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
    // branchId: Joi.number().min(1).required(),
});

module.exports.schema_getPullRequestsByUser = schema_getPullRequestsByUser;


const schema_update_branch = Joi.object({
    userId: Joi.number().min(1).required(),
    name: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')),
    description: Joi.string(),
    // createdAt : Joi.date().timestamp(),
    branchId: Joi.number().min(1).required(),
}).or('name', 'description');

module.exports.schema_update_branch = schema_update_branch;


const schema_getBranchInfo = Joi.object({
    userId: Joi.number().min(1).required(),
    branchName: Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')),
    branchId: Joi.number().min(1),
}).or('branchName', 'branchId');

module.exports.schema_getBranchInfo = schema_getBranchInfo;


const schema_getBranchesList = Joi.object({
    userId: Joi.number().min(1).required()
});

module.exports.schema_getBranchesList = schema_getBranchesList;