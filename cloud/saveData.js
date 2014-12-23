var express = require('express');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var app = express();
var _ = require('underscore');

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.
app.use(express.bodyParser());
app.use(express.cookieParser('CONVERTICS'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));

app.get('/submit', function(req, res) {
	var newData = Parse.Object.extend("newData");
	var newData = new newData();
 
	newData.set("senator", request.body.user.senator);
	newData.set("action", request.body.user.action);
	newData.set("bill", request.body.user.bill);
 
newData.save(null, {
  success: function(newData) {
    // Execute any logic that should take place after the object is saved.
    alert('New object created with objectId: ' + newData.id);
  },
  error: function(newData, error) {
    // Execute any logic that should take place if the save fails.
    // error is a Parse.Error with an error code and message.
    alert('Failed to create new object, with error code: ' + error.message);
  }
});