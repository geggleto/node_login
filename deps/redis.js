var redis = require("redis");

var client = redis.createClient({
    host : '192.168.0.83',
    port : '6379',
    password : 'abc123'
});
client.auth('abc123');

client.on('error', function (err) {
    console.log(err);
});
client.on('connect', function() {
    console.log('connected');
});

module.exports = client;