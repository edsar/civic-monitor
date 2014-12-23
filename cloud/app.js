var express = require('express');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var app = express();
var _ = require('underscore');

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.
app.use(express.bodyParser());
app.use(express.cookieParser('civicmon'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));

app.post('/submit', function(req, res) {
	console.log('started');
	console.log(req.body);
	console.log(req.param('legislator'));
	console.log(req.param('action'));
	console.log(req.param('bill'));
	console.log(req.param('notes'));
	
	var Activity = Parse.Object.extend("Activity");
	var activity = new Activity();

	activity.set("legislator", req.param('legislator'));
	activity.set("action", req.param('action'));
	activity.set("bill", req.param('bill'));
	activity.set("notes", req.param('notes'));
	activity.set("event", req.param("event"));
 
	activity.save(null, {
	  success: function(activity) {
		// Execute any logic that should take place after the object is saved.
		console.log('success');
		res.success();
	  },
	  error: function(activity, error) {
      // Execute any logic that should take place if the save fails.
      console.log('Failed to save data, please try again'); //Developer errors shouldn't be in release builds 
    }});
});

app.listen();


