const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const { PrivacyModel, validatePrivacy } = require('./Privacy');

const Privacy = mongoose.Schema(
	{
		value: {
			type: String,
			enum: ['public', 'private', 'friends', 'includes', 'excludes'],
			default: 'public',
		},
		includes: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		excludes: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
	},
	{ _id: false }
);

const PostSchema = new mongoose.Schema(
	{
		author: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
		},
		content: {
			type: String,
		},
		media: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'File',
				default: [],
			},
		],
		//lastest 5 first comments in post
		lastestFiveComments: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'Comment',
				// length: 5,
				default: [],
			},
		],
		//number react of post
		numberReact: {
			type: Number,
			default: 0,
		},
		//number share post
		numberShare: {
			type: Number,
			default: 0,
		},
		numberComment: {
			type: Number,
			default: 0,
		},
		//list tags in post
		tags: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		//ID of post shared
		sharedPost: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Post',
		},
		//privacy
		privacy: {
			type: Privacy,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
	},
	{ timestamps: true }
);

//soft delete
PostSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

//paginate
PostSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Post', PostSchema);
