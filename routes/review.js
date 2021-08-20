var express = require("express"),
	router = express.Router(),
	Product = require("../models/Product"),
	Review = require("../models/Review");

router.get('/product/:id/addReview', isLoggedIn, function(req, res){
	Product.findById(req.params.id, function(err, product){
		res.render("products/addReview", {product: product});	
	})
})

router.post('/product/:id/addReview', isLoggedIn, function(req, res){
	Product.findById(req.params.id, function(err, product){
		if(err){
			console.log(err);
			res.redirect("/product/" + req.params.id);
		}
		else{
			Review.create({text: req.body.text}, function(err, review){
				if(err){
					console.log(err);
				}
				else{
					review.author.id = req.user._id;
					review.rating = req.body.rating;
					review.author.username = req.user.username;
					review.save();
					product.reviews.push(review);
					product.save();
					res.redirect("/product/" + product._id);
				}
			})
		}
	})
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;