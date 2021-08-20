var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	methodOverride = require("method-override"),
	LocalStrategy = require("passport-local"),
	passport = require("passport");


var User = require("./models/User"),
	Product = require("./models/Product"),
	Cart = require("./models/Cart"),
	Review = require("./models/Review");

var mainRoutes = require("./routes/main"),
	reviewRoutes = require("./routes/review"),
	authRoutes = require("./routes/auth"),
	cartRoutes = require("./routes/cart"),
	adminRoutes = require("./routes/admin"),
	userRoutes = require("./routes/userAccount"),
	sellerRoutes = require("./routes/seller");


mongoose.connect("mongodb://localhost:27017/vit_cart", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
	secret: "I am Sanket",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res ,next){
	res.locals.currentUser = req.user;
	next();
})

app.use(mainRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(sellerRoutes);

app.listen(3000, function(){
	console.log("server is listening to port 3000");
})