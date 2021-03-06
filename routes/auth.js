var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/User");

router.get("/register", function(req, res){
	res.render("auth/register");
})

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username, email: req.body.email, phNumber: req.body.phNumber});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("auth/register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		})
	})
})

router.get("/login", function(req, res){
	res.render("auth/login");
})

router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/",
		failureRedirect: "/login"
	}), function(req, res){
})

router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;