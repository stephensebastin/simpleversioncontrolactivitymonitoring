const redis = require("redis");
const bluebird = require("bluebird");
const { logger } = require("../logger");
bluebird.promisifyAll(redis)
const client = redis.createClient()
var redisDown = true;

client.on('connect', async function() {
    logger.info('Redis Connected!');
    redisDown = false;

    client.keys('*_branch_lock_push', async function(err, keys) {
        if (err) return console.log(err);

        //ideally should not happen
        for (var i = 0, len = keys.length; i < len; i++) {
            var keyToSearch = keys[i];
            var branchLockVal = await getValueFromRedis(keyToSearch);
            if (branchLockVal == true || branchLockVal == 'true') {
                setTimeout(setValueFalseForKey.bind(null, keyToSearch), 3000); //if redis restarted - checking whether any transaction exists - assuming transaction timeout 3 seconds
                // in memory we can keep one variable incase redis fails and accessing redis that time
                //exception may thrown
                //checking in memory variable also
                //while redis restarts check this var and update value
            }

        }
    });
    /* 
    await client.flushall('ASYNC', (value) => {
        console.log("flush done");
    }); */ // should not flush redis during restart - need to add job/ fetch the changes from DB and update
});

client.on("error", function(error) {
    if (error.errno == 'ECONNREFUSED') {
        logger.error("Redis is not connected..." + error);
    }
    console.error(error);
});

function setValueFalseForKey(key) {
    setKeyToRedis(key, false);
}

async function setKeyToRedis(key, value) {
    await client.set(key, value);
}
async function getValueFromRedis(key) {
    return await client.getAsync(key);
}

module.exports.setKeyToRedis = setKeyToRedis;
module.exports.getValueFromRedis = getValueFromRedis;