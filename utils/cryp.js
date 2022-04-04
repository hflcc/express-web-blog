const crypto = require('crypto');

const SECRET_KEY = 'KJsdfo_234sdfF';

function md5(content) {
	let md5 = crypto.createHash('md5');
	return md5.update(content).digest('hex');
}

function getPassword(pd) {
	const str = `password=${pd}&key=${SECRET_KEY}`;
	return md5(str);
}

module.exports = {
	getPassword
};
