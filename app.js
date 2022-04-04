const ENV = process.env.NODE_ENV;
const path = require('path');
const fs = require('fs');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { redisClient } = require('./db/redis');
const logger = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const { ErrorModel } = require('./model/resModel');

const usersRouter = require('./routes/user');
const blogsRouter = require('./routes/blog');

const app = express();

// 日志
if (ENV === 'dev') {
	app.use(logger('dev'));
} else {
	const fileName = path.join(__dirname, 'logs', 'access.log');
	const writeStream = fs.createWriteStream(fileName, {
		flags: 'a'
	});
	app.use(logger('combined', {
		stream: writeStream
	}));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// session中间件
app.use(session({
	store: new RedisStore({
		client: redisClient
	}),
	secret: 'JHLwer_234jl12!',
	cookie: {
		path: '/',
		httpOnly: true,
		maxAge: 24 * 3600 * 1000 // 24小时
	}
}));
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', usersRouter);
app.use('/api/blog', blogsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'dev' ? err : {};

	// render the error page
	res.status(err.status || 500);
	if (err) {
		res.json(
			new ErrorModel(false, err.message, err.status)
		);
	}
});

module.exports = app;
