const express = require('express');
const categories = require('../routes/categories');
const courses = require('../routes/courses');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middlewares/error');

module.exports = function(app) {
  app.use(express.json());
  app.use(express.static('public'))
  app.use('/api/categories', categories);
  app.use('/api/courses', courses);
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}