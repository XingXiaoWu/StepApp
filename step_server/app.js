const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// 支持跨域
const cors = require('cors');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const registRouter = require('./routes/regist');
const syncRouter = require('./routes/sync');
// 
const app = express();
// 支持跨域
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// 注册
app.use('/regist', registRouter);
app.use('/sync', syncRouter);

module.exports = app;
