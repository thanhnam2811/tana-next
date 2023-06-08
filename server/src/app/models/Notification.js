const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const readBy = mongoose.Schema(
	{
		readerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		readAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const NotificationSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		content: {
			type: String,
			required: true,
		},
		// link to object create notification
		link: {
			type: String,
			required: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		receiver: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
		],
		readBy: [readBy],
	},
	{ timestamps: true }
);

// soft delete
NotificationSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
NotificationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Notification', NotificationSchema);
