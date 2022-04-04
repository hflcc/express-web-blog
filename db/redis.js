const redis = require('redis');
const { REDIS_CONF } = require('../conf/db');

const client = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

client.on('error', (err) => {
	console.log('Redis Client Error', err);
});

function redisSet(key, val) {
	if (typeof val === 'object') {
		val = JSON.stringify(val);
	}
	return client.set(key, val, redis.print);
}


function redisGet(key) {
	return new Promise((resolve, reject) => {
		client.get(key, (err, val) => {
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
	redisGet
};
