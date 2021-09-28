const Joi = require('joi');

const schema_push_changes = Joi.object({
    userId: Joi.number().min(1).required(),
    token :Joi.string().pattern(new RegExp('^[a-z0-9]+[-][0-9a-z]+[-][0-9a-z]+[-][0-9a-z]+[-][a-z0-9]+$')).required(),
    commitDetails:Joi.string()
    /*  commitDetails:Joi.array().items(
        Joi.object({
            commit_message:Joi.string().required(),
            timestamp: Joi.date().timestamp().required(),
            changes: Joi.object({
                add:Joi.array().items(
                    Joi.object({
                        filename:Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
                        content:Joi.string()
                    })
                ),
                update: Joi.array().items(
                    Joi.object({
                        filename:Joi.string().pattern(new RegExp('^[A-Za-z][A-Za-z0-9_-]{1,100}[A-Za-z0-9][.][a-zA-Z]+$')).required(),
                        lineChanges: Joi.array().items(
                            Joi.object({
                                lineNo:Joi.number().min(1),
                                insert:Joi.string(),
                                update:Joi.string()
                            })
                        )
                    })
                )
            }),
        })
    ) */
});

module.exports.schema_push_changes = schema_push_changes;


const schema_getallchangesetsbyuser = Joi.object({
    userId: Joi.number().min(1).required(),
    branchId: Joi.number().min(1).required()
});
module.exports.schema_getallchangesetsbyuser = schema_getallchangesetsbyuser;


const schema_getchangesetinfo = Joi.object({
    userId: Joi.number().min(1).required(),
    branchId: Joi.number().min(1).required(),
    changesetId: Joi.number().min(1).required()
});
module.exports.schema_getchangesetinfo = schema_getchangesetinfo;
