const mongoose = require('mongoose');
const Joi = require('joi');

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

//validate object
const validatePrivacy = () => {
	const schema = Joi.object({
		value: Joi.string().valid('public', 'private', 'friends', 'includes', 'excludes').required(),
		//check if privacy is includes or excludes
		includes: Joi.when('value', {
			is: Joi.string().valid('includes'),
			then: Joi.array().items(Joi.string().required()).required(),
			otherwise: Joi.array().items(Joi.string()),
		}),
		excludes: Joi.when('value', {
			is: Joi.string().valid('excludes'),
			then: Joi.array().items(Joi.string().required()).required(),
			otherwise: Joi.array().items(Joi.string()),
		}),
	});

	return schema;
};

const PrivacyModel = mongoose.model('Privacy', Privacy);

module.exports = {
	PrivacyModel,
	validatePrivacy,
};
