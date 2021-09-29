const { sequelize, users, branches, pullrequests, changesets, changeset_details, fileinfo } = require('../models');
const { logger } = require('../logger');
const branch = require('../routes/branch');
const redisUtil = require('../redisUtil');
const { Op, col } = require("sequelize");



async function initDB(operation) {
    try {
        if (operation == 'sync') {
            await sequelize.sync({ force: true });
            logger.info("Database sync success");
        } else {
            await sequelize.authenticate();
            logger.info("Database Connected");
        }
    } catch (err) {
        logger.error(`DB Connection Failed ${err.message}`);
        process.exit(1);
    }
}


module.exports.initDB = initDB;

function deleteUser(matchValue) {
    return deleteRow(users, 'id', matchValue);
}
async function deleteBranch(columnName, matchValue) {
    // return deleteRow(branches,columnName,matchValue);
    //doubt:: ask for method entry exit
    try {
        const result = await sequelize.transaction(async(t) => {

            var drecord;
            if (columnName == 'id') {
                drecord = await branches.destroy({ where: { id: matchValue } }, { transaction: t });
                return drecord;
            } else if (columnName == 'name') {
                drecord = await branches.destroy({ where: { name: matchValue } }, { transaction: t });
                return drecord;
            } else {
                throw new Error("Invalid column name");
            }

        }).then((value) => {
            if (value > 0) {
                logger.info("Branch deleted successfully :: " + columnName + ":" + matchValue);
            } else {
                logger.info("Branch details not found for :: " + columnName + ":" + matchValue);
            }
            return value;
        });

        return result;

    } catch (err) {
        logger.error("Error while deleting branch:: " + err.message);
        throw err;
    }
}

async function deleteRow(tableName, columnName, matchValue) {

    try {
        const result = await sequelize.transaction(async(t) => {

            var drecord;
            if (columnName == 'id') {
                drecord = await tableName.destroy({ where: { id: matchValue } }, { transaction: t });
                return drecord;
            } else if (columnName == 'name') {
                drecord = await tableName.destroy({ where: { name: matchValue } }, { transaction: t });
                return drecord;
            } else {
                throw new Error("Invalid column name");
            }

        }).then((value) => {
            if (value > 0) {
                logger.info(`Record Deleted on ${tableName.name} column ${columnName} value ${matchValue}`);
            } else {
                logger.info("No record found to delete :: " + columnName + ":" + matchValue);
            }
            return value;
        });

        return result;

    } catch (err) {
        logger.error("Error while deleting record on  :: " + tableName.name + " :: " + err.message); //todo need to print/log stack trace
        throw err;
    }
}

async function addUser(userInfo) {
    var name = userInfo.name;
    var email = userInfo.email;
    var team = userInfo.team;
    try {
        const result = await sequelize.transaction(async(t) => {
            const user = await users.create({ name, email, team }, { transaction: t });
            return user;

        }).then((value) => {
            logger.info("Created new user  :: " + value.id);
            return value.id;
        });

        return result;
    } catch (err) {
        if (err.name == 'SequelizeUniqueConstraintError') {
            throw new Error("Email id already exists");
        }
        logger.error(`Used creation error for ${name}  ${team} :: Error ${err.message}`); //todo remove
        throw err;
    }
}

module.exports.addUser = addUser;
module.exports.deleteUser = deleteUser;
module.exports.deleteBranch = deleteBranch;


async function createBranch(branchInfo) {
    var name = branchInfo.name;
    var description = branchInfo.description;
    try {
        const result = await sequelize.transaction(async(t) => {
            const branch = await branches.create({ name, description }, { transaction: t });
            return branch;
        }).then((value) => {
            logger.info(`User ${branchInfo.userId} created branch ${value.name}`);
            return value.name;
        });
        return result;
    } catch (err) {
        if (err.name == "SequelizeUniqueConstraintError") {
            logger.error("Error while " + branchInfo.userId + " creating branch :: Error: Branch name already exists ::" + err.name + "  :: " + err.sql);
            throw new Error("Branch already exists. Create unique name. ");
        } else {
            logger.error("Error while " + branchInfo.userId + " creating branch :: " + err.message + " ::" + err.name + "  :: " + err.sql);
        }
        throw err;
    }
}
module.exports.createBranch = createBranch;


async function pullBranch(params) {
    var userId = params.userId;
    var branchName = params.branchName;
    try {

        //map user to branch then directly query user mappings with branch 
        const result = await sequelize.transaction(async(t) => {

            const user = await users.findOne({ where: { id: userId } });
            if (user == null) {
                throw new Error("User details not present");
            }
            var user_id = user.id;
            const branch = await branches.findOne({ where: { name: branchName } });
            if (branch == null) {
                throw new Error("Branch details not found");
            }
            var branch_id = branch.id;

            const pullRequest = await pullrequests.create({ userId: user_id, branchId: branch_id }, { transaction: t });
            return pullRequest;
        }).then((value) => {
            logger.info("new pull request created by user  :: " + userId + " For branch " + branchId);
            return value.pull_token;
        });

        return result;
    } catch (err) {
        logger.info("Error while making pullrequest for branch " + branchId + " by User " + userId + " :: Error:" + err.message);
        throw err;
    }
}

module.exports.pullBranch = pullBranch;
//get branch details
async function getBranchDetails(reqInfo) {
    try {

        if (reqInfo.branchId != undefined && reqInfo.branchId != null) {
            logger.info(`user ${reqInfo.userid} requested to get branch details with ID ${reqInfo.branchId}`);
            var branch = await branches.findOne({ where: { id: reqInfo.branchId } });
            return branch;

        } else if (reqInfo.branchName != undefined && reqInfo.branchName != null) {
            logger.info(`user ${reqInfo.userId} requested to get branch details with Name ${reqInfo.branchName}`);
            var branch = await branches.findOne({ where: { name: reqInfo.branchName } });
            return branch;
        } else {
            throw new Error("branch ID or name must be present to query");
        }

    } catch (err) {
        logger.info(`Error while user ${reqInfo.userid} requested to get all branch details with  ${reqInfo}, Error : ${err.message}`);
        throw err;
    }
}
module.exports.getBranchDetails = getBranchDetails;

async function getAllBranchDetails() {
    try {
        var branchList = await branches.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (branchList.length > 0) {
            var branchListArr = [];
            for (var i = 0; i < branchList.length; i++) {
                var dataValues = branchList[i].dataValues;
                delete dataValues['createdAt'];
                delete dataValues['updatedAt'];
                delete dataValues['description'];
                branchListArr.push(dataValues);
            }
            return branchListArr;
        }

        return null;
    } catch (err) {
        logger.error("Error while getting list of branches :: " + err.message); //todo remove
        throw err;
    }
}
module.exports.getAllBranchDetails = getAllBranchDetails;



async function createFile(reqInfo) {
    var fileName = reqInfo.fileName;
    var branchId = reqInfo.branchId;
    var userId = reqInfo.userId;
    try {

        const result = await sequelize.transaction(async(t) => {
            const user = await users.findOne({ where: { id: userId } });
            if (user == null) {
                throw new Error("User info is not present. Cannot add a file");
            }
            var branch = await branches.findOne({ where: { id: branchId } });
            if (branch == null) {
                throw new Error("Branch doesn't exist. Create branch and add file");
            }
            var valueFromRedis = await redisUtil.getValueFromRedis(branchId + '_branch_lock_push');
            console.log("valueFromRedis " + valueFromRedis);
            if (valueFromRedis != null && (valueFromRedis == true || valueFromRedis == 'true')) {
                throw new Error("File Creation failed. Already one push in progress");
            }

            redisUtil.setKeyToRedis(branchId + '_branch_lock_push', true);
            var commit_message = `Adding ${fileName} to the branch`;
            const pushChanges = await changesets.create({ description: commit_message, user_id: userId, branchId: branchId }, { transaction: t });
            if (pushChanges == null) {
                throw new Error("Changeset creation error");
            }
            var changeSetId = pushChanges.id;
            const fileObj = await fileinfo.create({ filename: fileName, branchId: branchId }, { transaction: t });
            if (fileObj == null) {
                throw new Error("File creation failed for " + fileName);
            } else {
                var additionInfoObj = { "filename": fileName }
                const pushChanges = await changeset_details.create({ addition: additionInfoObj, changesetId: changeSetId, filename: fileName }, { transaction: t });
                if (pushChanges == null) {
                    throw new Error("Pushing failed for " + fileName);
                }
            }
            return fileObj;
        }).then((value) => {
            logger.info("New file " + value.filename + " added to the branch : " + branchId + " by User: " + userId); //all log convert into json with action
            return value.filename;
        });

        var d = new Date();
        var timeNow = d.getTime();
        redisUtil.setKeyToRedis(branchId + '_branch_last_push_time', timeNow);
        return result;
    } catch (err) {
        if (err.name == "SequelizeUniqueConstraintError") {
            logger.error("Error while creating a file by user : " + userId + " on branch :" + branchId + ":: Error: File already exists ::" + err.name + "  :: " + err.sql);
            throw new Error("File already exists. Create unique name. ");
        } else {
            logger.error("Error while creating a file by user : " + userId + " on branch :" + branchId + ":: Error: " + err.message + " ::" + err.name + "  :: " + err.sql);
        }
        throw err;
    } finally {
        redisUtil.setKeyToRedis(branchId + '_branch_lock_push', false);
    }
}
module.exports.createFile = createFile;


async function removeFile(reqInfo) {

    var fileName = reqInfo.fileName;
    var branchId = reqInfo.branchId;
    var userId = reqInfo.userId;
    try {

        const result = await sequelize.transaction(async(t) => {
            const user = await users.findOne({ where: { id: userId } });
            if (user == null) {
                throw new Error("User info is not present. Cannot add a file");
            }
            var branch = await branches.findOne({ where: { id: branchId } });
            if (branch == null) {
                throw new Error("Branch doesn't exist. Create branch and add file");
            }
            var valueFromRedis = await redisUtil.getValueFromRedis(branchId + '_branch_lock_push');

            if (valueFromRedis != null && (valueFromRedis == true || valueFromRedis == 'true')) {
                throw new Error("File deletion failed. Change in progress");
            }
            redisUtil.setKeyToRedis(branchId + '_branch_lock_push', true);
            var commit_message = `Deleting ${fileName} to the branch`;
            const pushChanges = await changesets.create({ description: commit_message, user_id: userId, branchId: branchId }, { transaction: t });
            if (pushChanges == null) {
                throw new Error("Changeset creation error");
            }
            var changeSetId = pushChanges.id;

            const fileObj = await fileinfo.destroy({ where: { filename: fileName, branchId: branchId } }, { transaction: t });
            if (fileObj == null) {
                throw new Error("File deletion failed for " + fileName);
            } else if (fileObj == 0) {
                throw new Error("File " + fileName + " not present to delete");
            } else {

                var deletionInfoObj = fileName;
                const pushChanges = await changeset_details.create({ deletion: deletionInfoObj, changesetId: changeSetId, filename: fileName }, { transaction: t });
                if (pushChanges == null) {
                    throw new Error("Delete failed for " + fileName);
                }

            }
            return fileObj;
        }).then((value) => {
            if (value > 0) {
                logger.info("File  " + fileName + "  deleted  by user :: " + userId + " on branch :" + branchId);
            } else {
                logger.info("File  " + fileName + " not deleted by user :: " + userId + " on branch :" + branchId);
            }

            return value.filename;
        });


        var d = new Date();
        var timeNow = d.getTime();
        redisUtil.setKeyToRedis(branchId + '_branch_last_push_time', timeNow);
        return result;
    } catch (err) {
        logger.error("Error while removing a file on branch : " + branchId + " by user : " + userId + ":: Error: " + err.message + " ::" + err.name + "  :: " + err.sql);
        throw err;
    } finally {
        redisUtil.setKeyToRedis(branchId + '_branch_lock_push', false);
    }
}
module.exports.removeFile = removeFile;


async function getChangestInfo(reqInfo) {
    try {

        var changeset = await changesets.findOne({ where: { id: reqInfo.changesetId } });
        /*   if (changeset == null) {
              throw new Error("Changeset details not found");
          } */
        var chansetInfo = {};
        chansetInfo = changeset.dataValues;
        delete chansetInfo["updatedAt"];
        var changesetDetailsObj = await changeset_details.findAll({
            where: { changesetId: changeset.id },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        if (changesetDetailsObj == null) {
            throw new Error("Error while fetching changeset details");
        }
        chansetInfo["changesetDetails"] = changesetDetailsObj;

        logger.info(`user ${reqInfo.userid} requested to get changeset details with ID ${reqInfo.changesetId}`);
        return chansetInfo;

    } catch (err) {
        logger.info(`Error while user ${reqInfo.userid} requested to get changeset details with  ${reqInfo}`);
        throw err;
    }
}
module.exports.getChangestInfo = getChangestInfo;

async function getAllChangesetsByUser(params) {
    var userId = params.userId;
    var branchId = params.branchId;
    try {
        const user = await pullrequests.findOne({ where: { userId: userId } });
        if (user == null) {
            throw new Error("User info is not present.");
        }
        var branch = await branches.findOne({ where: { id: branchId } });
        if (branch == null) {
            throw new Error("Branch doesn't exist.");
        }

        var changesetList = await changesets.findAll({
            where: { user_id: userId, branchId: branchId },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        /*  if(changesetList.length > 0) {
              var branchListArr = [];
              for( var i=0; i < changesetList.length; i++){
                  var dataValues = changesetList[i].dataValues;
                  delete dataValues['createdAt'];
                  branchListArr.push(dataValues);
              }
              return branchListArr;
          }
        */
        logger.info(`User ${userId} requested to get all changeset list`);
        return changesetList;
    } catch (err) {
        logger.error("Error while getting changeset list of user: " + userId + " :branch: " + branchId + " :Error:" + err.message);
        throw err;
    }
}
module.exports.getAllChangesetsByUser = getAllChangesetsByUser;


async function getFileInfo(reqInfo) {
    try {

        //if (reqInfo.fileName != undefined && reqInfo.fileName != null) {
        /* if (reqInfo.userId == null || reqInfo.userId == undefined) {
             throw new Error("User ID needed to query");
         }
         if (reqInfo.branchId == null || reqInfo.branchId == undefined) {
             throw new Error("Branch ID needed to query");
         }*/ // handled with JOI
        logger.info(`user ${reqInfo.userid} requested to get details about the files with name ${reqInfo.fileName}`);
        var fileInfo = await fileinfo.findOne({ where: { filename: reqInfo.fileName, branchId: reqInfo.branchId } });

        if (fileInfo == null) {
            throw new Error("FileInfo details not found");
        }
        return fileInfo;

        /*} else {
            throw new Error("fileInfo need name to query");
        }*/

    } catch (err) {
        logger.error(`Error while user ${reqInfo.userid} requested to get changeset details with  ${reqInfo}`);
        throw err;
    }
}
module.exports.getFileInfo = getFileInfo;



async function getUserInfo(userId) {
    try {


        if (userId == null || userId == undefined) {
            throw new Error("User ID needed to query");
        }

        logger.info(`User details requested for ID ${userId}`);
        var fileInfo = await users.findOne({ where: { id: userId } });
        return fileInfo;

    } catch (err) {
        logger.info(`Error while getting user ${userId} details} :: error :${err.message}`);
        throw err;
    }
}

module.exports.getUserInfo = getUserInfo;


async function getPullRequestsByUser(reqInfo) {
    try {
        var pullList = await pullrequests.findAll({
            where: { userId: reqInfo.userId },
            order: [
                ['createdAt', 'DESC']
            ]
        });

        if (pullList.length > 0) {
            var branchListArr = [];
            for (var i = 0; i < pullList.length; i++) {
                var dataValues = pullList[i].dataValues;
                delete dataValues['createdAt'];
                delete dataValues['updatedAt'];
                branchListArr.push(dataValues);
            }
            logger.info(`User ${reqInfo.userId} requested to get all pullerequests.`);
            return branchListArr;
        }
        return null;
    } catch (err) {
        logger.error("Error while getting list of pullrequests :: " + err.message); //todo remove
        throw err;
    }
}
module.exports.getPullRequestsByUser = getPullRequestsByUser;



async function updateUserInfo(reqInfo) {
    try {
        var updateValues = {};
        for (var key in reqInfo) {
            if (key == "userId" || key == "updatedAt") {
                continue;
            }
            if (reqInfo[key] != undefined && reqInfo[key] != null) {
                var val = reqInfo[key];

                updateValues[key] = val;
            }
        }
        if (Object.keys(updateValues).length == 0) {
            throw new Error("Update value must be mentioned");
        }
        const result = await sequelize.transaction(async(t) => {
            //   var  updateVal = await users.update(updateValues,{where:{id: {[Op.gte]  : reqInfo.id}}});
            var updateVal = await users.update(updateValues, { where: { id: reqInfo.userId } });
            return updateVal;
        }).then((value) => {
            if (value[0] > 0) {
                logger.info(`User details updated for ${reqInfo.userId}`);
            } else {
                logger.info(`User details not updated for ${reqInfo.userId}`);
            }
            return value[0];
        });
        return result;
    } catch (err) {
        logger.error("Error while updating user details for User ID " + reqInfo.userId + " Error:: " + err.message);
        throw err;
    }
}
module.exports.updateUserInfo = updateUserInfo;


async function updateBranchInfo(reqInfo) {
    try {

        var updateValues = {};
        for (var key in reqInfo) {
            if (key == "branchId" || key == "updatedAt") {
                continue;
            }
            if (reqInfo[key] != undefined && reqInfo[key] != null) {
                var val = reqInfo[key];
                updateValues[key] = val;
            }
        }
        if (Object.keys(updateValues).length == 0) {
            throw new Error("Update value must be mentioned");
        }
        const result = await sequelize.transaction(async(t) => {
            var updateVal = await branches.update(updateValues, { where: { id: reqInfo.branchId } });
            return updateVal;
        }).then((value) => {
            if (value[0] > 0) {
                logger.info(`Branch ${branchId} details updated by ${reqInfo.userId}`);
            } else {
                logger.info(`Branch ${branchId} details not updated. Update request by ${reqInfo.userId}`);
            }
            return value[0];
        });

        return result;
    } catch (err) {
        logger.error("Error while updating branch " + branchId + " details by " + userId + " :Error :: " + err.message);
        throw err;
    }
}
module.exports.updateBranchInfo = updateBranchInfo;