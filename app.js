var redis = require("redis"),
    client = redis.createClient();

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);

client.get("string key", function(err, res){
    console.log(err, res);
});

client.quit();