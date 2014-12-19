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

app.get('/', function(req, res) {
	res.render('login.ejs');
});

app.get('/welcome', function(req, res) {
	res.render('welcome.ejs');
});

app.post('/gotosignup', function(req, res) {
	res.redirect('/signup');
});

app.post('/gotologin', function(req, res) {
	res.redirect('/login');
});

app.get('/login', function(req, res) {
	res.render('login.ejs');
});

// Clicking submit on the login form triggers this.
app.post('/login', function(req, res) {
	Parse.User.logIn(req.body.username, req.body.password).then(function() {
	// Login succeeded, redirect to contributors.
	// parseExpressCookieSession will automatically set cookie.
		res.redirect('/navigation');
		//res.render('contributors-parsetable.ejs');
	},
	function(error) {
		  // Login failed, redirect back to login form.
		  res.redirect('/login');
	});
});

app.get('/signup', function(req, res) {
	res.render('signup.ejs');
});

app.post('/logout', function(req, res) {
	Parse.User.logOut();
	res.redirect('/login');
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

// You could have a "Profile" link on your website pointing to this.
app.get('/profile', function(req, res) {
	// Display the user profile if user is logged in.
	if (Parse.User.current()) {
	  // We need to fetch because we need to show fields on the user object.
	  Parse.User.current().fetch().then(function(user) {
	    // Render the user profile information (e.g. email, phone, etc).
	  },
	  function(error) {
	    // Render error page.
	  });
	} else {
	  // User not logged in, redirect to login form.
	  res.redirect('/login');
	}
});


app.post('/gotonavigation', function(req, res) {
	res.redirect('/navigation');
});

app.get('/navigation', function(req, res) {
	res.render('navigation.ejs');
});

app.post('/gotofaq', function(req, res) {
	res.redirect('/faq');
});

app.get('/faq', function(req, res) {
	res.render('faq.ejs');
});

app.post('/gotocontributors', function(req, res) {
	res.redirect('/contributors');
});

app.post('/gotosummary', function(req, res) {
	res.redirect('/summary');
});

app.post('/gotofullresults', function(req, res) {
	res.redirect('/fullresults');
});


app.get('/summary', function(req, res) {

	// var username = Parse.User.current().getUsername();
	// console.log(JSON.stringify(username));	

	if (Parse.User.current()) {
	  	
	  	console.log(JSON.stringify(Parse.User.current()));
	  	var userID = Parse.User.current().id;
		console.log(userID);
		var candidate;
		
		// console.log(JSON.stringify());
		//candidate=user.get("username");
		
		// var userQuery = new Parse.Query(Parse.User);

		// Parse.User.current().fetch().then(function (user) {
		// userQuery.get(Parse.User.current().id, function(user){
		// console.log("userID" + userID);
		// userQuery.get(userID).then(function (user) {
		//   console.log("userID" + userID);
		//   console.log("user" + JSON.stringify(user));
		//   candidate=user.get("username");
		// });
	
		var page = '/slides.html';
	  	console.log('/' + userID + page);
		res.redirect('/' + userID + page);
	}
});

app.get('/fullresults', function(req, res) {

	// var username = Parse.User.current().getUsername();
	// console.log(JSON.stringify(username));	

	if (Parse.User.current()) {
	  	
	  	console.log(JSON.stringify(Parse.User.current()));
	  	var userID = Parse.User.current().id;
		console.log(userID);
		var candidate;
		
		// console.log(JSON.stringify());
		//candidate=user.get("username");
		
		// var userQuery = new Parse.Query(Parse.User);

		// Parse.User.current().fetch().then(function (user) {
		// userQuery.get(Parse.User.current().id, function(user){
		// console.log("userID" + userID);
		// userQuery.get(userID).then(function (user) {
		//   console.log("userID" + userID);
		//   console.log("user" + JSON.stringify(user));
		//   candidate=user.get("username");
		// });
	
		var page = '/fullresults.csv';
	  	console.log('/' + userID + page);
		res.redirect('/' + userID + page);
	}
});

app.listen();


