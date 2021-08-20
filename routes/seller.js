var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/User"),
	Product = require("../models/Product"),
	Review = require("../models/Review");

router.get("/seller/register", function(req, res){
	res.render("auth/registerSeller");
})

router.post("/seller/register", function(req, res){
	var newUser = new User({username: req.body.username, email: req.body.email, phNumber: req.body.phNumber, isSeller: true});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		})
	})
})

router.get("/manage-shop/:id", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		res.render("seller/sellerPanel", {seller: seller});
	})
})

router.get("/manage-shop/:id/edit", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		res.render("seller/editInfo", {seller: seller});
	})
})

router.put("/manage-shop/:id", isLoggedIn, function(req, res){
	User.updateOne({_id: req.params.id}, {$set: {"username": req.body.username, "phNumber": req.body.phNumber}}, function(err, seller){
		if(err){
			console.log(err);
		}
		res.redirect("/manage-shop/" + seller._id);
	})
})

router.get("/manage-shop/:id/products", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		Product.find({seller: seller._id}, function(err, products){
			if(err){
				console.log(err);
			}
			res.render("seller/sellerPanel_products", {seller: seller, product: products})
		})
	})
})

router.get("/manage-shop/:id/products/addProduct", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		res.render("seller/addProduct");
	})
})

router.post("/manage-shop/:id/products/addProduct", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		var newProduct = {name: req.body.name, category: req.body.category, image: req.body.image, price: req.body.price, stock: req.body.stock, description: req.body.description, seller: seller._id}
		Product.create(newProduct, function(err, product){
			res.redirect("/manage-shop/" + seller._id + "/products")
		})
	})
})

router.get("/manage-shop/:sid/products/:pid/edit", function(req, res){
	User.findById(req.params.sid, function(err, seller){
		if(err){
			console.log(err);
		}
		Product.findById(req.params.pid, function(err, product){
		if(err){
			console.log(err);
		}
		res.render("seller/editProduct", {product: product, seller: seller});
	})
	})
})

router.put("/manage-shop/:sid/products/:pid/edit", isLoggedIn, function(req, res){
	Product.findByIdAndUpdate(req.params.pid, req.body.product, function(err, product){
		if(err){
			console.log(err);
		}
		res.redirect("/manage-shop/" + product.seller + "/products");
	})
})

router.get("/manage-shop/:id/orders", isLoggedIn, function(req, res){
	User.findById(req.params.id, function(err, seller){
		if(err){
			console.log(err);
		}
		res.render("seller/sellerPanel_orders", {seller: seller})
	})
})

router.get("/manage-shop/:sid/products/:pid/delete", isLoggedIn, function(req, res){
	Product.findByIdAndDelete(req.params.pid, function(err, product){
		if(err){
			console.log(err);
		}
		Review.deleteMany({_id: {$in: product.reviews}}, (err) => {
			if(err){
				console.log(err);
			}
			res.redirect("/manage-shop/" + req.params.sid + "/products")
		})
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated() && req.user.isSeller){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;