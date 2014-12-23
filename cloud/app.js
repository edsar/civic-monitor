var express = require('express');
var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');
var parseExpressRawBody = require('parse-express-raw-body');

var app = express();
var _ = require('underscore');

app.set('views', 'cloud/views');
app.set('view engine', 'ejs');
app.use(parseExpressHttpsRedirect());  // Require user to be on HTTPS.
app.use(express.bodyParser());
app.use(express.cookieParser('CONVERTICS'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));
// For webhooks
app.use(parseExpressRawBody()); 
 
app.post('/receive_raw_data',
         express.basicAuth('YOUR_USERNAME', 'YOUR_PASSWORD'),
         function(req, res) {
  // If you send this endpoint JSON or www-form-encoded data, then
  // express.bodyParser will fill req.body with the corresponding data.
  // Otherwise, parseExpressRawBody will fill req.body with a Buffer
  // object containing the request body.  You can also convert this
  // Buffer to a string using req.body.toString().
});
 

app.get('/contributors', function(req, res) {

	if (Parse.User.current()) {
	  // No need to fetch the current user for querying Note objects.
	  var Contributor = Parse.Object.extend("AllCallListNov11");
	  var contQuery = new Parse.Query(Contributor);
	  
	  // console.log(JSON.stringify(req.cookies));
	  // console.log(JSON.stringify(Parse.User.current().id));

	  var userQuery = new Parse.Query(Parse.User);

	  userQuery.get(Parse.User.current().id, function(user){
	  	// console.log(JSON.stringify(user));
	  	contQuery.equalTo("ID", user.getUsername());
	  	contQuery.find().then(function(results) {
		    // Render contributors
		    // res.render('contributors.ejs', {responsedata:res, contributors:results});
			// var attribs = _.map(results, function(each) { 
			// 	// console.log(JSON.stringify(each));
			// 	return each.attributes});
		  	res.render('simpler-table.ejs', {contributors: results});
	  
		},
		  function(error) {
		    // Render error page.
		    res.render(JSON.stringify(error));
		  });
	  });
	} else {
	  // Render a public welcome page, with a link to the '/login' endpoint.
	  res.redirect('/welcome');
	}
  });





app.get('/submit', function(req, res) {
	var newData = Parse.Object.extend("newData");
	var newData = new newData();
 
	newData.set("senator", request.body.user.senator);
	newData.set("action", request.body.user.action);
	newData.set("bill", request.body.user.bill);
 
newData.save(null, {
  success: function(newData) {
    // Execute any logic that should take place after the object is saved.
    alert('Data saved');
  },
  error: function(newData, error) {
    // Execute any logic that should take place if the save fails.
    alert('Failed to save data, please try again'); //Developer errors shouldn't be in release builds 
  }
});

app.listen();


