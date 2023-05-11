const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const MessageSchema = new mongoose.Schema(
	{
		conversation: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Conversation',
		},
		sender: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		reader: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		text: {
			type: String,
		},
		media: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'File',
				default: [],
			},
		],
		deleted: {
			type: Boolean,
			default: false,
		},
		isSystem: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
		collection: 'messages',
	}
);

//soft delete
MessageSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

//paginate
MessageSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Message', MessageSchema);
