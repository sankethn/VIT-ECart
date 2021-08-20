var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/User"),
	Product = require("../models/Product"),
	Review = require("../models/Review");

router.get("/manage-site/:id", isLoggedIn, function(req, res){
		Product.find({}, function(err, product){
			if(err){
				console.log(err);
			}
			res.render("admin/adminPanel_products", {product: product});	
		})
})

router.get("/manage-site/:aid/:pid/edit", isLoggedIn, function(req, res){
	Product.findById(req.params.pid, function(err, product){
		if(err){
			console.log(err);
		}
		res.render("admin/editProduct", {product: product, admin: req.params.aid});
	})
})

router.put("/manage-site/:aid/:pid/edit", isLoggedIn, function(req, res){
	Product.update({_id: req.params.pid}, {$set: {"name": req.body.name, "image": req.body.image, "price": req.body.price, "stock": req.body.stock, "description": req.body.description, "category": req.body.category}}, function(err, product){
		if(err){
			console.log(err);
		}
		res.redirect("/manage-site/" + req.params.aid);
	})
})

router.get("/manage-site/:aid/:pid/delete", isLoggedIn, function(req, res){
	Product.findByIdAndDelete(req.params.pid, function(err, product){
		if(err){
			console.log(err);
		}
		Review.deleteMany({_id: {$in: product.reviews}}, (err) => {
			if(err){
				console.log(err);
			}
			res.redirect("/manage-site/" + req.params.aid);
		})
	})
})

router.get("/manage-site/:aid/users", isLoggedIn, function(req, res){
	User.find({}, function(err, user){
		if(err){
			console.log(err);
		}
		res.render("admin/adminPanel_users", {user: user});
	})
})

router.get("/manage-site/:aid/users/:uid/edit", function(req, res){
	User.findById(req.params.uid, function(err, user){
		if(err){
			console.log(err);
		}
		res.render("admin/editInfo", {user: user});
	})
})

router.put("/manage-site/:aid/users/:uid/edit", function(req, res){
	User.updateOne({_id: req.params.uid}, {$set: {"username": req.body.username, "phNumber": req.body.phNumber}}, function(err, seller){
		if(err){
			console.log(err);
		}
		res.redirect("/manage-site/" + req.params.aid + "/users");
	})
})

router.get("/manage-site/:aid/users/:uid/delete", function(req, res){
	User.findByIdAndDelete(req.params.uid, function(err, user){
		if(err){
			console.log(err);
		}
		Product.deleteMany({seller: req.params.uid}, function(err){
			if(err){
				console.log(err);
			}
			Review.deleteMany({author: {id: req.params.uid}}, function(err){
				if(err){
					console.log(err);
				}
				res.redirect("/manage-site/" + req.params.aid + "/users");
			})
		})
	})
})

router.get("/manage-site/:aid/users/:uid/products", function(req, res){
	Product.find({seller: req.params.uid}, function(err, product){
		if(err){
			console.log(err);
		}
		res.render("admin/seller_products", {product: product});
	})
})





function isLoggedIn(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;