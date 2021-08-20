var express = require("express"),
	router = express.Router(),
	Product = require("../models/Product"),
	Cart = require("../models/Cart");

router.post("/product/:pid/:uid/addCart", isLoggedIn, function(req, res){
	var qty = req.body.quantity;
    Product.findById(req.params.pid, function(err, product){
		if(err){
			console.log(err);
		}
		let newCart = Cart();
		newCart.owner = req.params.uid;
		newCart.pid = product._id;
		newCart.image = product.image;
		newCart.name = product.name;
		newCart.price = product.price;
		newCart.description = product.description;
		newCart.qty = qty;
		newCart.save();
		// console.log(newCart);
		res.redirect("/cart");
	})
	
})

router.get("/cart", isLoggedIn, function(req, res){
	Cart.find({owner: req.user._id}, function(err, userCart){
		console.log("clicked: " + userCart);
		console.log(req.user._id);
		if(err){
			console.log(err);
		}
		res.render("cart", {cart: userCart});
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

