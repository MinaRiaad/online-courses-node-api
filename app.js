const express = require('express');
const config =require('config');
const winston=require('winston');
const app = express();

// require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/prod')(app);

const port=process.env.PORT || config.get('port') ;
app.listen(8000,()=>{
  winston.info(`listening at port ${port}` )
})

module.exports = app;
