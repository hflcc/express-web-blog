const { SuccessModel, ErrorModel } = require('../model/resModel');
const { getBlogList, getBlogDetail, newBlog, updateBlog, delBlog } = require('../controller/blog');
const express = require('express');
const { getUserInfo } = require('../controller/user');
const { loginCheck } = require('../middleware/loginCheck');
const router = express.Router();

// 获取博客列表
router.get('/list', loginCheck, async (req, res, next) => {
	const author = req.query.author || '';
	const keyword = req.query.keyword || '';
	const list = await getBlogList(author, keyword);
	res.json(new SuccessModel(list));
});

// 获取用户信息
router.get('/user', async (req, res, next) => {
	const id = req.query.id;
	if (!id) {
		res.json(new ErrorModel([], '查询id不能为空'));
		return;
	}
	const result = await getUserInfo(id);
	if (result) {
		const obj = res[0] || {};
		res.json(new SuccessModel(obj, '查询成功'));
	}
});

// 获取博客详情
router.get('/detail', async (req, res, next) => {
	const id = req.query.id;
	if (!id) {
		res.json(
			new ErrorModel({}, '微博ID不能为空')
		);
		return;
	}
	const data = await getBlogDetail(id);
	if (data) {
		res.json(new SuccessModel(data, '查询成功'));
	}
});

// 新建博客 (需要登录校验中间件)
router.post('/new', loginCheck, async (req, res, next) => {
	req.body.author = req.session.username;

	const data = await newBlog(req.body);
	if(data) {
		res.json(new SuccessModel({ id: data.insertId }, '新增博客成功'));
	}
});

// 更新博客
router.post('/update', loginCheck, async (req, res, next) => {
	const id = req.query.id;
	const result = await updateBlog(id, req.body);
	if (result) {
		res.json(new SuccessModel(result, '更新成功'));
		return;
	}
	res.json(new ErrorModel(false, '更新失败'));
});

// 删除博客
router.post('/del', loginCheck, async (req, res, next) => {
	const id = req.query.id;
	const result = await delBlog(id, req.session.username);
	if (result) {
		res.json(new SuccessModel(true, '删除成功'));
		return;
	}
	res.json(new ErrorModel(false, '删除失败'));
});

module.exports = router;
