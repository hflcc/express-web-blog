const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

redisClient.on('error', (err) => {
	console.log('Redis redisClient Error', err);
});

function redisSet(key, val) {
	if (typeof val === 'object') {
		val = JSON.stringify(val);
	}
	return redisClient.set(key, val, redis.print);
}


function redisGet(key) {
	return new Promise((resolve, reject) => {
		redisClient.get(key, (err, val) => {
			if (err) {
				reject(err);
				return;
			}
			if (val === null) {
				resolve(null);
				return;
			}
			try {
				resolve(JSON.parse(val));
			} catch (err) {
				resolve(val);
			}
		});
	});
}

module.exports = {
	redisSet,
	redisGet,
	redisClient
};
