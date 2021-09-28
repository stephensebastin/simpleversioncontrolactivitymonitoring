const Joi = require('joi');
const schema_user_create = Joi.object({
            
            name : Joi.string().required(),
            email: Joi.string().email().lowercase().required(),

            team: Joi.string().required()
       /* password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),*/

       // repeat_password: Joi.ref('password'),

     /*    access_token: [
            Joi.string(),
            Joi.number()
        ], */

        
});
module.exports.schema_user_create = schema_user_create;

const schema_user_delete = Joi.object({
        userId: Joi.number().min(1).required(),
       // name : Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')).required(),
       // description: Joi.string(),
});
module.exports.schema_user_delete = schema_user_delete;


const schema_user_getInfo = Joi.object({
     userId: Joi.number().min(1).required(),
    //name : Joi.string().pattern(new RegExp('^[A-Z][A-Za-z0-9_]{1,50}[A-Z0-9]$')).required(),
    // description: Joi.string(),
});

module.exports.schema_user_getInfo = schema_user_getInfo;



const schema_update_user = Joi.object({
     userId: Joi.number().min(1).required(),
     name : Joi.string(),
     team: Joi.string(),
     email: Joi.string().lowercase().email()
 }).or('name', 'email', 'team');
 
 module.exports.schema_update_user = schema_update_user;
 
