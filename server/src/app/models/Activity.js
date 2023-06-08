const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ActivitySchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			require: true,
		},
		type: {
			type: String,
			enum: ['post', 'comment', 'reaction', 'friend', 'share', 'report'],
			default: 'post',
			require: true,
		},
		// Target of the activity (e.g., post, comment, etc.)
		friend: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		post: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
		comment: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Comment',
		},
		reaction: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'React',
		},
		content: {
			type: String,
			required: true,
		},
		// link to object
		link: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

// soft delete
ActivitySchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
ActivitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Activity', ActivitySchema);
