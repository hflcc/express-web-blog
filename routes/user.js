const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
const express = require('express');
const router = express.Router();

router.post('/login', (req, res, next) => {
	const { username, password } = req.body;
	login(username, password).then(data => {
		if (data.username) {
			req.session.username = data.username;
			req.session.realname = data.realname;
			res.json(new SuccessModel(true, '登录成功'));
		} else {
			res.json(new ErrorModel(false, '账号或密码错误'));
		}
		next();
	});
});

module.exports = router;
