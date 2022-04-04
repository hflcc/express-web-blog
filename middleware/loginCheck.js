const { ErrorModel } = require('../model/resModel');

const loginCheck = (req, res, next) => {
	if (req.session.username) {
		next();
		return;
	}
	res.json(new ErrorModel(false, '尚未登录'));
};

module.exports = {
	loginCheck
};
