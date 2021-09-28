const redis = require("redis");
const bluebird =  require("bluebird");
bluebird.promisifyAll(redis)
const client = redis.createClient()

client.on('connect', async function() {
    console.log('Redis Connected!');    
    await client.flushall('ASYNC', (value)=>{
        console.log("flush done");
    }); // should not flush redis during restart - need to add job/ fetch the changes from DB and update
  });

client.on("error", function(error) {
    console.error(error);
 });
  

async function setKeyToRedis(key, value) {
    await client.set(key, value);
}
async function getValueFromRedis(key){
    return  await client.getAsync(key);
 }

 module.exports.setKeyToRedis=setKeyToRedis;
 module.exports.getValueFromRedis=getValueFromRedis;
