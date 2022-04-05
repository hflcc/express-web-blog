/* 中间件原理 */
const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
	constructor() {
		this.routes = {
			all: [],
			get: [],
			post: []
		};
	}

	register(path) {
		const info = {};
		if (typeof path === 'string') {
			info.path = path;
			info.stack = slice.call(arguments, 1);
		} else {
			info.path = '/';
			info.stack = slice.call(arguments, 0);
		}
		return info;
	}

	use() {
		const info = this.register.apply(this, arguments);
		this.routes.all.push(info);
	}

	get() {
		const info = this.register.apply(this, arguments);
		this.routes.get.push(info);
	}

	post() {
		const info = this.register.apply(this, arguments);
		this.routes.post.push(info);
	}

	match(method, url) {
		let stack = [];
		if (url === 'favicon.ico') {
			return stack;
		}
		const curRoutes = [...this.routes.all, ...this.routes[method]];
		curRoutes.forEach(item => {
			if (url.indexOf(item.path) === 0) {
				stack = stack.concat(item.stack);
			}
		});
		return stack;
	}

	// 核心next机制
	handleCore(req, res, stack) {
		const next = () => {
			// 拿到第一个匹配的中间件
			const middleware = stack.shift();
			if (middleware) {
				// 执行中间件函数
				middleware(req, res, next);
			}
		};
		next();
	}

	callback() {
		return (req, res) => {
			res.json = (data) => {
				res.setHeader('Content-type', 'application/json');
				res.end(JSON.stringify(data));
			};
			const url = req.url;
			const method = req.method.toLowerCase();
			const resultList = this.match(method, url);
			this.handleCore(req, res, resultList);
		};
	}

	listen(...args) {
		const server = http.createServer(this.callback());
		server.listen(...args);
	}
}

// 工厂函数
module.exports = () => {
	return new LikeExpress();
};
