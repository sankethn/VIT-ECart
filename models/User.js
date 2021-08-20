var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	email: String,
	phNumber: Number,
	address: String,
	orders: [
		{
			paid: {type: Number, default: 0},
			qty: {type: Number, default: 1},
			item: {type: mongoose.Schema.Types.ObjectID, ref: 'Product'}
		}
	],
	isAdmin: {
		type: Boolean,
		default: false
	},
	isSeller: {
		type: Boolean,
		default: false
	}
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);

