const { SuccessModel, ErrorModel } = require('../model/resModel');
const { getBlogList, getBlogDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const express = require('express');
const { getUserInfo } = require('../controller/user');
const router = express.Router();
// 统一的登录验证函数
const loginCheck = (req) => {
	if (!req.session.username) {
		return Promise.resolve(new ErrorModel(false, '尚未登录'));
	}
};

// 获取博客列表
router.get('/list', async (req, res, next) => {
	const author = req.query.author || '';
	const keyword = req.query.keyword || '';
	const list = await getBlogList(author, keyword);
	res.json(new SuccessModel(list));
	next();
});

// 获取用户信息
router.get('/user', async (req, res, next) => {
	const id = req.query.id;
	if (!id) {
		res.json(new ErrorModel([], '查询id不能为空'));
		next();
		return;
	}
	const result = await getUserInfo(id);
	if (result) {
		const obj = res[0] || {};
		res.json(new SuccessModel(obj, '查询成功'));
	}
	next();
});

// 获取博客详情
router.get('/detail', async (req, res, next) => {
	const id = req.query.id;
	if (!id) {
		res.json(
			new ErrorModel({}, '微博ID不能为空')
		);
		next();
		return;
	}
	const data = await getBlogDetail(id);
	if (data) {
		res.json(new SuccessModel(data, '查询成功'));
		next();
	}
});

// 新建博客
router.post('/new', async (req, res, next) => {
	// 校验有无登录
	const loginCheckResult = loginCheck(req);
	if (loginCheckResult) {
		res.json(loginCheckResult);
		next();
		return;
	}

	req.body.author = req.session.username;

	const data = await newBlog(req.body);
	if(data) {
		res.json(new SuccessModel({ id: data.insertId }, '新增博客成功'));
		next();
	}
});

// 更新博客
router.post('/update', async (req, res, next) => {
	const id = req.query.id;
	// 校验有无登录
	const loginCheckResult = loginCheck(req);
	if (loginCheckResult) {
		res.json(loginCheckResult);
		next();
		return;
	}
	const result = await updateBlog(id, req.body);
	if (result) {
		res.json(new SuccessModel(result, '更新成功'));
		next();
		return;
	}
	res.json(new ErrorModel(false, '更新失败'));
	next();
});

// 删除博客
router.post('/del', async (req, res, next) => {
	const id = req.query.id;
	// 校验有无登录
	const loginCheckResult = loginCheck(req);
	if (loginCheckResult) {
		res.json(loginCheckResult);
		next();
		return;
	}
	const result = await delBlog(id, req.session.username);
	if (result) {
		res.json(new SuccessModel(true, '删除成功'));
		next();
		return;
	}
	res.json(new ErrorModel(false, '删除失败'));
	next();
});

module.exports = router;
