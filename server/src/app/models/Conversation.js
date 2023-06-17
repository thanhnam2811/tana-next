const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const userDeletedAllMessages = mongoose.Schema(
	{
		userId: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		deletedAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{ _id: false }
);

const history = mongoose.Schema(
	{
		editor: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		content: {
			type: String,
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
	},
	{ _id: false }
);

const member = mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		role: {
			type: String,
			enum: ['admin', 'member'],
			default: 'member',
		},
		nickname: {
			type: String,
			default: '',
		},
		changedNicknameBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		addedAt: {
			type: Date,
			default: Date.now(),
		},
		addedBy: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
	},
	{ _id: false }
);

const ConversationSchema = new mongoose.Schema(
	{
		members: [member],
		name: {
			type: String,
		},
		creator: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		history: [history],
		user_deleted: [userDeletedAllMessages],
		type: {
			type: String,
			enum: ['direct', 'group'],
			default: 'direct',
		},
		avatar: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'File',
		},
		lastest_message: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Message',
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

// soft delete
ConversationSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
ConversationSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Conversation', ConversationSchema);
