const { exec, escape } = require('../db/mysql');

// 获取博客列表数据
const getBlogList = (author, keyword) => {
	let sql = 'select * from blogs where 1=1 ';
	if (author) {
		sql += `and author=${escape(author)} `;
	}
	if (keyword) {
		sql += `and title like '%${keyword}%' `;
	}
	sql += 'order by createtime desc';
	return exec(sql);
};

// 根据id获取博客详情
const getBlogDetail = (id) => {
	let sql = `select * from blogs where id=${escape(id)}`;
	return exec(sql);
};

// 根据post body中的请求体参数新建博客
const newBlog = (blogData = {}) => {
	const {title, content, author} = blogData;
	const timestamp = Date.now();
	let sql = `insert into blogs (author, title, content, createtime) values (${escape(author)}, ${escape(title)}, ${escape(content)}, ${timestamp})`;
	return exec(sql);
};

/**
 * @info 根据id更新博客
 * @param id {String} 博客标识id
 * @param blogData {Object} 需要更新的博客内容json
 * */
const updateBlog = (id, blogData = {}) => {
	const { title, content } = blogData;
	const timeStamp = Date.now();
	let sql = `update blogs set title='${title}', content='${content}', createtime='${timeStamp}' where id=${id}`;
	return exec(sql).then(res => {
		return res.affectedRows > 0;
	});
};

/**
 * @info 根据id删除博客 软删除
 * @param id {String} 博客标识id
 * @param username {String} 用户名
 * */
const delBlog = (id, username) => {
	let sql = `update blogs set state=0 where id=${id} and author=${username + ''}`;
	return exec(sql).then(res => {
		return res.affectedRows > 0;
	}).catch(() => {
		return false;
	});
};

module.exports = {
	getBlogList,
	getBlogDetail,
	newBlog,
	updateBlog,
	delBlog
};
