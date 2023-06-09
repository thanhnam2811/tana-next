const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const Joi = require('joi');
const { PrivacyModel, validatePrivacy } = require('./Privacy');

const education = mongoose.Schema(
	{
		school: {
			type: String,
		},
		degree: {
			type: String,
		},
		major: {
			type: String,
		},
		from: {
			type: Date,
		},
		to: {
			type: Date,
		},
		// privacy
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
		//
	},
	{ _id: false }
);

const work = mongoose.Schema(
	{
		company: {
			type: String,
		},
		position: {
			type: String,
		},
		from: {
			type: Date,
		},
		to: {
			type: Date,
		},
		// privacy
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const contact = mongoose.Schema(
	{
		type: {
			type: String,
			enum: ['phone', 'email', 'facebook', 'twitter', 'instagram', 'github', 'linkedin', 'youtube', 'website'],
			required: true,
		},
		value: {
			type: String,
		},
		// privacy
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
		brief: {
			type: Boolean,
			default: false,
		},
	},
	{ _id: false }
);

const address = mongoose.Schema(
	{
		country: {
			type: String,
			required: true,
		},
		province: {
			type: String,
			required: true,
		},
		district: {
			type: String,
		},
		ward: {
			type: String,
		},
		address: {
			type: String,
		},
	},
	{ _id: false }
);

const labelOfGender = {
	male: 'nam',
	female: 'nữ',
	other: 'khác',
};

const gender = mongoose.Schema(
	{
		value: {
			type: String,
			enum: ['male', 'female', 'other'],
			default: 'female',
		},
		label: {
			type: String,
			enum: ['nam', 'nữ', 'khác'],
			default: 'nữ',
		},
		// privacy
		privacy: {
			type: PrivacyModel.schema,
			default: {
				value: 'public',
				includes: [],
				excludes: [],
			},
		},
	},
	{ _id: false }
);

const friend = mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		date: {
			type: Date,
			default: Date.now,
		},
		interactionScore: {
			type: Number,
			default: 0,
		},
	},
	{ _id: false }
);

const UserSchema = new mongoose.Schema(
	{
		fullname: {
			type: String,
			require: true,
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true,
		},
		password: {
			type: String,
			min: 6,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isPermanentlyLocked: {
			type: Boolean,
			default: false,
		},
		reasonLock: {
			type: String,
		},
		lockTime: {
			type: Date,
		},
		loginAttempts: {
			type: Number,
			default: 0,
		},
		isOnline: {
			type: Boolean,
			default: false,
		},
		lastAccess: {
			type: Date,
			default: Date.now(),
		},
		profilePicture: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'File',
			default: '649fdbbf25bcc0c94aeb8d04',
		},
		coverPicture: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'File',
		},
		education: [education],
		work: [work],
		contact: [contact],
		friendRequests: [friend],
		sentRequests: [friend],
		friends: [friend],
		followers: [friend],
		followings: [friend],
		city: {
			type: address,
		},
		from: {
			type: address,
		},
		gender: {
			type: gender,
			default: {
				type: 'male',
				label: 'nam',
				privacy: {
					value: 'public',
					includes: [],
					excludes: [],
				},
			},
		},
		birthdate: {
			type: Date,
		},
		hobbies: {
			type: [String],
		},
		role: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'Role',
			default: '6389667eb7991bdd04987103', // USER
		},
		refreshToken: {
			type: String,
		},
	},
	{ timestamps: true }
);

// soft delete
UserSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// Validate
const validate = (user) => {
	const schema = Joi.object({
		fullname: Joi.string().min(1).max(50),
		profilePicture: Joi.string(),
		coverPicture: Joi.string(),
		city: Joi.object({
			country: Joi.string().min(1).max(200).required(),
			province: Joi.string().min(1).max(200).required(),
			district: Joi.string().min(1).max(200),
			ward: Joi.string().min(1).max(200),
			address: Joi.string().min(1).max(200),
		}),
		from: Joi.object({
			country: Joi.string().min(1).max(200).required(),
			province: Joi.string().min(1).max(200).required(),
			district: Joi.string().min(1).max(200),
			ward: Joi.string().min(1).max(200),
			address: Joi.string().min(1).max(200),
		}),
		education: Joi.array().items(
			Joi.object({
				school: Joi.string().min(1).max(200).required(),
				degree: Joi.string().min(1).max(50).required(),
				major: Joi.string().min(1).max(50).required(),
				from: Joi.date().required(),
				to: Joi.date().allow(null).allow(''),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		work: Joi.array().items(
			Joi.object({
				company: Joi.string().min(1).max(200).required(),
				position: Joi.string().min(1).max(50).required(),
				from: Joi.date().required(),
				to: Joi.date().allow(null).allow(''),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		contact: Joi.array().items(
			Joi.object({
				type: Joi.string()
					.valid(
						'phone',
						'email',
						'facebook',
						'twitter',
						'instagram',
						'github',
						'linkedin',
						'youtube',
						'website'
					)
					.required(),
				value: Joi.string().min(1).max(100).required(),
				privacy: validatePrivacy(),
				brief: Joi.boolean(),
			})
		),
		gender: Joi.object({
			value: Joi.string().valid('male', 'female', 'other').required(),
			label: Joi.string().valid('nam', 'nữ', 'khác').required(),
			privacy: validatePrivacy(),
		}),
		birthdate: Joi.date(),
		hobbies: Joi.array().items(Joi.string().min(1).max(50)),
	});

	return schema.validate(user);
};

// paginate
UserSchema.plugin(mongoosePaginate);

const hiddenField = ['password', 'refreshToken'];
const User = mongoose.model(
	'User',
	UserSchema.set('toJSON', {
		transform(doc, user) {
			hiddenField.forEach((field) => delete user[field]);
			return user;
		},
	})
);

module.exports = { User, validate, labelOfGender };
