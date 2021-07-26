var createError = require('http-errors');
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var cors = require('cors');
var app = express();
var mongoose = require("mongoose");
var config = require("./config/config");
const bodyParser = require('body-parser')


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.locals.moment = require('moment')
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  bodyParser.json({
    limit: '60mb',
  })
)
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


let port = 3001;
app.listen(port, () => {
  console.log("server started at " + port)
  mongoose.connect(config.mongoUri, { useNewUrlParser: true })
    .then(() => {
      console.log("connected to db")
      var seed = require("./seed/seedUsers");
      seed.seedUsers();
       seed.seedPartner();
       seed.seedOffer();
    }).catch((err) => {
      console.log("error connecting database");
      throw (err)
    });

})

// mongoose.connect(config.mongoUri, { useNewUrlParser: true })
//   .then(() => {
//     console.log("connected to db")
//     var seed = require("./seed/seedUsers");
//     seed.seedUsers();
//     seed.seedPartner();
//     seed.seedOffer();

//   }).catch((err) => {
//     console.log("error connecting database");
//     throw (err)
//   });


module.exports = app;
