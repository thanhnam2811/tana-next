const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const RoleSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			enum: ['ADMIN', 'USER', 'STAFF'],
			required: true,
		},
		description: {
			type: String,
		},
	},
	{ timestamps: true }
);

RoleSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
RoleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Role', RoleSchema);
