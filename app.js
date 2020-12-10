var createError = require('http-errors');
var express = require('express');
var path = require('path');
var request = require("request");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var getTrendingRouter = require('./routes/getTrending');
var getSearchRouter = require('./routes/getSearch');

var app = express();

var port = process.env.PORT || 3000;
console.log('PORT: '+port);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/slds', express.static(__dirname + '/node_modules/@salesforce-ux/design-system/'));
app.use('/sfsdk', express.static(__dirname + '/node_modules/blocksdk/'));

//app.use('/gjssdk', express.static(__dirname + '/node_modules/giphy-js-sdk-core/'));
app.use('/', indexRouter);
app.use('/getTrending', getTrendingRouter);
app.use('/getSearch', getSearchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;
  // render the error page
  //console.log(err.message);
  //res.render(err.message);
  res.status(err.status || 500);
  //res.status(err.message || 500);
  //const status = err.status || 500;
  //res.status(status);
   res.render('error');
});


app.listen(port);

module.exports = app;
