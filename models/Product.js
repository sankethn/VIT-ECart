'use strict';

var mongoose = require('mongoose');


var productSchema = new mongoose.Schema({
	category: String,
	name: String,
	price: Number,
	image: String,
	description: String,
	stock: Number,
	seller: {type: mongoose.Schema.Types.ObjectID, ref: 'User'},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectID, ref: 'Review'
		}
	]
})

productSchema.index({'name': "text", 'category': "text", 'description': "text"});

module.exports = mongoose.model("Product", productSchema);