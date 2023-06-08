const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'user',
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 5 * 60,
	},
});

module.exports = mongoose.model('token', tokenSchema);
