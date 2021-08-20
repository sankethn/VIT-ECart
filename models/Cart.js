var mongoose = require('mongoose');


var cartSchema = new mongoose.Schema({
	owner: String,
	pid: String,
	image: String,
	name: String,
	price: Number,
	description: String,
	qty: {type: Number, default: 1}
	
})

module.exports = mongoose.model("Cart", cartSchema);