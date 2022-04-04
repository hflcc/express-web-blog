const { SuccessModel, ErrorModel } = require('../model/resModel');
const { login } = require('../controller/user');
const express = require('express');
const router = express.Router();

router.post('/login', function(req, res, next) {
	const { username, password } = req.body;
	return login(username, password).then(data => {
		if (data.username) {
			res.json(new SuccessModel(true, '登录成功'));
		} else {
			res.json(new ErrorModel(false, '账号或密码错误'));
		}
		next();
	});
});

module.exports = router;
