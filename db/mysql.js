const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db');

const con = mysql.createConnection(MYSQL_CONF);

// 不用重复创建connection,类似单例模式
con.connect();

// 统一执行sql的函数
function exec(sql = '') {
	return new Promise((resolve, reject) => {
		try {
			con.query(sql, (err, res) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(res);
			});
		} catch (err) {
			reject(err);
		}
	});
}

module.exports = {
	exec,
	escape: mysql.escape
};
