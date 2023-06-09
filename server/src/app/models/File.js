const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const FileSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: '',
		},
		originalname: {
			type: String,
		},
		type: {
			type: String,
			required: true,
		},
		size: {
			type: Number,
		},
		link: {
			type: String,
			required: true,
		},
		public_id: {
			type: String,
		},
		is_System: {
			type: Boolean,
			default: false,
		},
		conversation: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Conversation',
		},
		post: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
		album: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Album',
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{
		timestamps: true,
	}
);

// soft delete
FileSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
FileSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('File', FileSchema);
