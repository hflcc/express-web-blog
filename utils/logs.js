const fs = require('fs');
const path = require('path');

function writeLog(writeStream, log) {
	writeStream.write(log + '\n');
}


function createWriteStream(fileName) {
	const fullName = path.join(__dirname, '../', '../', 'logs', fileName);
	return fs.createWriteStream(fullName, {
		flags: 'a' // 累计
	});
}

// 写访问日志
const accessWriteStream = createWriteStream('access.log');
function createAccessLog(log) {
	writeLog(accessWriteStream, log);
}


module.exports = {
	createAccessLog
};
