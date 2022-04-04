/**
 * 通过node readline逐行读取日志文件
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname, '../', '../', 'logs', 'access.log');

const readStream = fs.createReadStream(fileName);

const rl = readline.createInterface({
	input: readStream
});

let chromeNum = 0;
let sumNum = 0;

rl.on('line', lineData => {
	// 排除空行情况
	if (!lineData) return;
	sumNum++;
	const arr = lineData.split(' -- ');
	if (arr[2] && arr[2].indexOf('Chrome') > 0) {
		chromeNum++;
	}
});

rl.on('close', () => {
	console.log('用chrome访问的量是:', chromeNum);
	console.log('访问的总量是:', sumNum);
});
