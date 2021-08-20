var express = require("express"),
	router = express.Router(),
	Product = require("../models/Product"),
	Review = require("../models/Review");

// Product.create(
// 	{
// 		category: "men",
// 		name: "Blue Shirt",
// 		price: 100,
// 		image: "https://rukminim1.flixcart.com/image/714/857/k65d18w0/shirt/p/4/t/48-bfrybluesht02ab-being-fab-original-imaecvnxndp3zbdn.jpeg?q=50",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "women",
// 		name: "Peach Tshirt",
// 		price: 100,
// 		image: "https://www.iciw.com/bilder/artiklar/zoom/10163-015_1.jpg?m=1568126730",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "grocery",
// 		name: "Aashirvad Aata",
// 		price: 100,
// 		image: "https://www.jiomart.com/images/product/600x600/490000041/aashirvaad-whole-wheat-atta-10-kg-0-20200621.jpeg",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "foodDrinks",
// 		name: "Tropicana Cranberry Juice",
// 		price: 100,
// 		image: "https://images-na.ssl-images-amazon.com/images/I/71SXbtp3nWL._SL1500_.jpg",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "used",
// 		name: "Iphone 11 pro",
// 		price: 100,
// 		image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-11-pro-select-2019-family_GEO_EMEA?wid=882&amp;hei=1058&amp;fmt=jpeg&amp;qlt=80&amp;op_usm=0.5,0.5&amp;.v=1567812929188",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "rent",
// 		name: "Canon camera",
// 		price: 100,
// 		image: "https://smhttp-ssl-87640.nexcesscdn.net/pub/media/catalog/product/cache/2264c9e38777ed202d5c3170a063a3cf/c/a/can2774.jpg",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// 	{
// 		category: "stationery",
// 		name: "Colour A4 Paper",
// 		price: 100,
// 		image: "https://rukminim1.flixcart.com/image/352/352/paper/k/h/f/multipurpose-color-paper-coloured-paper-atlas-original-imaerjyrxchwb4zh.jpeg?q=70",
// 		description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled ",
// 		stock: 20
// 	},
// )

router.get("/", function(req, res){
	Product.find({}, function(err, allProducts){
		if(err){
			console.log(err);
		}
		else{
			
			
			
		var dataset = {}


		Product.find({}).populate('reviews').exec(function(err, products){
			if(err){
				console.log(err);
			}
			else{
				for(let product of products) {

					for(let review of product.reviews) {
						if(!dataset[review.author.username]) {
							dataset[review.author.username] = {};
						}
						dataset[review.author.username] = {
							...dataset[review.author.username],
							[product._id]: review.rating
						};
					}
				}
				Product.find({$or: [{name: "Bingo! Mad Angles Very Peri Peri 130g"}, {name: "parachute mens classic"}]}, function(err, rec){
					res.render("products/index", {products: allProducts, recommendedProducts: dataset, rec: rec});
					console.log(JSON.stringify(dataset, null, 10))
					console.log(rec);
				})	
			}
		})
			
			console.log(req.user);
			// console.log(req.user._id);
			if(req.user){
				console.log("Recommended Products:")
				console.log("--");
				recommendation_eng(dataset, req.user.username, pearson_correlation);
				console.log("--");
			}
		}
	})
})

/* search */

router.post("/search", function(req, res){
	Product.find({$text: {$search: req.body.search}}, function(err, product){
		if(err){
			console.log(err);
		}
		res.render("products/category", {product: product});
	})
})

/* click product */

router.get("/product/:name", function(req, res){
	Product.findById(req.params.name).populate("reviews").exec(function(err, foundProduct){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/product", {product: foundProduct});
		}
	})
})

/* categories */

router.get("/category/:name", function(req, res){
	Product.find({category: req.params.name}, function(err, product){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/category", {product: product});
		}
	})
})

/* typeButton */

router.get('/buyNew', function(req, res){
	Product.find({$or: [{category: "men"}, {category: "women"}, {category: "grocery"}, {category: "stationery"}]}, function(err, product){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/category", {product: product})
		}
	})
})

router.get('/buyUsed', function(req, res){
	Product.find({category: "used"}, function(err, product){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/category", {product: product})
		}
	})
})

router.get('/buyRent', function(req, res){
	Product.find({category: "rent"}, function(err, product){
		if(err){
			console.log(err);
		}
		else{
			res.render("products/category", {product: product})
		}
	})
})



/*----------------------------------------*/
/*----------Algorithm---------------------*/
/*----------------------------------------*/

// var dataset = {}


// Product.find({}).populate('reviews').exec(function(err, products){
// 	if(err){
// 		console.log(err);
// 	}
	
// 	for(let product of products) {
		
// 		for(let review of product.reviews) {
// 			if(!dataset[review.author.username]) {
// 				dataset[review.author.username] = {};
// 			}
// 			dataset[review.author.username] = {
// 				...dataset[review.author.username],
// 				[product._id]: review.rating
// 			};
// 		}
// 	}


	
	// console.log(JSON.stringify(dataset, null, 10))
	
	// product.reviews.forEach(function(review){
	// 	Review.findById(review, function(err, rv){
	// 		var user = rv.author.id;
	// 		var obj = dataset.user;
	// 		if(err){
	// 			console.log(err);
	// 		}
	// 		else{
	// 			if(obj == "undefined"){
	// 				obj = new Object();
	// 				obj[product.name] = rv.rating;
	// 			}
	// 			obj[product.name] = rv.rating;
	// 			return(dataset);
	// 		}
	// 	})
	// })
// })

// Product.find({}, function(err, product){
// 	if(err){
// 		console.log(err);
// 	}
// 	product.reviews.forEach(review => console.log(review));
// })

// console.log(dataset);

var len = function(obj) {
  var len = 0;
  for (var i in obj) {
    len++
  }
  return len;
}

var pearson_correlation = function(dataset, p1, p2) {
  var existp1p2 = {};
  for (item in dataset[p1]) {
    if (item in dataset[p2]) {
      existp1p2[item] = 1
    }
  }
  var num_existence = len(existp1p2);
  if (num_existence == 0) return 0;

  var p1_sum = 0,
    p2_sum = 0,
    p1_sq_sum = 0,
    p2_sq_sum = 0,
    prod_p1p2 = 0;

  for (var item in existp1p2) {
    p1_sum += dataset[p1][item];
    p2_sum += dataset[p2][item];
    p1_sq_sum += Math.pow(dataset[p1][item], 2);
    p2_sq_sum += Math.pow(dataset[p2][item], 2);
    prod_p1p2 += dataset[p1][item] * dataset[p2][item];
  }
  var numerator = prod_p1p2 - (p1_sum * p2_sum / num_existence);
  var st1 = p1_sq_sum - Math.pow(p1_sum, 2) / num_existence;
  var st2 = p2_sq_sum - Math.pow(p2_sum, 2) / num_existence;
  var denominator = Math.sqrt(st1 * st2);
  if (denominator == 0) return 0;
  else {
    var val = numerator / denominator;
    return val;
  }

}


var recommendation_eng = function(dataset, person, distance) {

  var totals = {

    setDefault: function(props, value) {
      if (!this[props]) {
        this[props] = 0;
      }
      this[props] += value;
    }
  },
    simsum = {
      setDefault: function(props, value) {
        if (!this[props]) {
          this[props] = 0;
        }

        this[props] += value;
      }
    },
    rank_lst = [];
  for (var other in dataset) {
    if (other === person) continue;
    var similar = distance(dataset, person, other);

    if (similar <= 0) continue;
    for (var item in dataset[other]) {
      if (!(item in dataset[person]) || (dataset[person][item] == 0)) {
        totals.setDefault(item, dataset[other][item] * similar);
        simsum.setDefault(item, similar);


      }

    }


  }

  for (var item in totals) {
    if (typeof totals[item] != "function") {

      var val = totals[item] / simsum[item];
      rank_lst.push({ val: val, items: item });
    }
  }
  rank_lst.sort(function(a, b) {
    return b.val < a.val ? -1 : b.val > a.val ?
      1 : b.val >= a.val ? 0 : NaN;
  });
  var recommend = [];
  for (var i in rank_lst) {
    recommend.push(rank_lst[i].items);
  }
  return [rank_lst, recommend];
}



module.exports = router;