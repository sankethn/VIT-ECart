var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/User");

router.get("/manage-account/:bid", isLoggedIn, function(req, res){
	User.findById(req.params.bid, function(err, buyer){
		if(err){
			console.log(err);
		}
		res.render("buyer/buyer_panel", {buyer: buyer});
	})
})

router.get("/manage-account/:bid/orders", isLoggedIn, function(req, res){
	res.render("buyer/buyerPanel_orders");
})

router.get("/manage-account/:id/edit", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, buyer){
		if(err){
			console.log(err);
		}
		res.render("buyer/editInfo", {buyer: buyer});
	})
})

router.put("/manage-account/:id/edit", isLoggedIn, function(req, res){
	User.updateOne({_id: req.params.id}, {$set: {"username": req.body.username, "phNumber": req.body.phNumber}}, function(err, buyer){
		if(err){
			console.log(err);
		}
		res.redirect("/manage-account/" + req.params.id);
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated() && !req.user.isAdmin && !req.user.isSeller){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;