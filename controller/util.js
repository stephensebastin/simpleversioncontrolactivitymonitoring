const { sequelize, users, branches, fileinfo, pullrequests, changeset_details, changesets } = require('../models');
const { logger } = require('../logger');
const redisUtil = require('../redisUtil');


async function processPush(pushInfo) {
    var userId = pushInfo.userId;
    var token = pushInfo.token;
    var pr_branch_id;
    var commitDetails = pushInfo.commitDetails;

    try {
        if (commitDetails != null && commitDetails.length > 0) {
            const result = await sequelize.transaction(async(t) => {
                const pr = await pullrequests.findOne({ where: { pull_token: token } });
                if (pr == null) {
                    throw new Error("Pull request details not present.. Cannot proceed checkin");
                }
                var pr_user_id = pr.userId;

                if (userId != pr_user_id) {
                    throw new Error("User ID not matches with pull token.. Cannot proceed checkin");
                }
                pr_branch_id = pr.branchId;

                var valueFromRedis = await redisUtil.getValueFromRedis(pr_branch_id + '_branch_lock_push');
                if (valueFromRedis != null && (valueFromRedis == true || valueFromRedis == 'true')) {
                    throw new Error("Push to branch is locked");
                }

                var lastestCommitTimestamp = getLastCommitTime(commitDetails);
                var lastPushTime = await redisUtil.getValueFromRedis(pr_branch_id + '_branch_last_push_time');

                if (lastPushTime > lastestCommitTimestamp) {
                    throw new Error("Push failed due to time conflict. Please try after pull and update"); //indeirectly commit time must be greater
                }
                redisUtil.setKeyToRedis(pr_branch_id + '_branch_lock_push', true);
                for (var i = 0; i < commitDetails.length; i++) {
                    var commitJSON = commitDetails[i];
                    var commit_message = commitJSON.commit_message;
                    const pushChanges = await changesets.create({ description: commit_message, user_id: pr_user_id, branchId: pr_branch_id }, { transaction: t });
                    if (pushChanges == null) {
                        throw new Error("Changeset row creation error");
                    }
                    var changeSetId = pushChanges.id;
                    var changesJson = commitJSON.changes;
                    var updateInfo = changesJson.update;
                    if (updateInfo != undefined && updateInfo != null && updateInfo.length > 0) {

                        for (var j = 0; j < updateInfo.length; j++) {
                            var updateInfoObj = updateInfo[j];
                            var fileName = updateInfoObj.filename;
                            var fileObj = await checkFileExist(fileName);
                            if (fileObj != null) {
                                //var fileId = fileObj.id;
                                const pushChanges = await changeset_details.create({ changes: updateInfoObj.lineChanges, changesetId: changeSetId, filename: fileName }, { transaction: t });
                                if (pushChanges == null) {
                                    throw new Error("Pushing failed for while adding changeset details" + fileName);
                                }
                            } else {
                                throw new Error(fileName + " not exists to update row ");
                            }
                        }
                    }
                    var additionInfo = changesJson.add;
                    if (additionInfo != undefined && additionInfo != null && additionInfo.length > 0) {
                        try {
                            for (var j = 0; j < additionInfo.length; j++) {
                                var additionInfoObj = additionInfo[j];
                                var fileName = additionInfoObj.filename;

                                const fileObj = await fileinfo.create({ filename: fileName, branchId: pr_branch_id }, { transaction: t });
                                if (fileObj == null) {
                                    throw new Error("File creation failed for " + fileName);
                                } else {
                                    const pushChanges = await changeset_details.create({ addition: additionInfoObj, changesetId: changeSetId, filename: fileName }, { transaction: t });
                                    if (pushChanges == null) {
                                        throw new Error("Pushing failed for " + fileName);
                                    }
                                }

                            }
                        } catch (additionErr) {
                            if (additionErr.name == "SequelizeUniqueConstraintError") {

                                throw new Error("File name must be uniqe. Duplicate file name entered for new file addition");
                            } else {
                                throw err;
                            }
                        }
                    }
                }
                return commitDetails.length;
            }).then((value) => {
                logger.info(value + " commits pushed to Branch ID :: " + pr_branch_id + " by " + userId);
                return value;
            });
            try {
                var d = new Date();
                var timeNow = d.getTime();
                redisUtil.setKeyToRedis(pr_branch_id + '_branch_last_push_time', timeNow);
                redisUtil.setKeyToRedis(pr_branch_id + '_branch_lock_push', false);
            } catch (redisError) {
                console.log("redis error");
            }
            return result;
        } else {
            throw new Error("Commit details should not be emty")
        }
    } catch (err) {
        if (err.message == 'Push to branch is locked') {
            logger.info(" Error occurred while checkin :: User ID :: " + userId + " : Error" + "Push not allowed. Already a push in progress");
            throw new Error("Push not allowed. Already a push in progress");
        } else {
            logger.error(" Error occurred while checkin :: User ID :: " + userId + " : Error" + err.message);
            redisUtil.setKeyToRedis(pr_branch_id + '_branch_lock_push', false);
            throw err;
        }
    }
}
module.exports.processPush = processPush;

async function checkFileExist(fileName) { //check if file exists and returns fileid if exists else returns null
    try {
        const fileInfoObj = await fileinfo.findOne({ where: { filename: fileName } });
        return fileInfoObj;
    } catch (err) {
        logger.error("Error while searching file:: " + err.message);
        throw err;
    }
}

function getLastCommitTime(commitDetails) {
    var latestCommit = commitDetails[(commitDetails.length) - 1];
    return latestCommit.timestamp;
}