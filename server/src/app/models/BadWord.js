const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const BadWordSchema = new mongoose.Schema(
	{
		words: {
			type: [String],
			require: true,
		},
	},
	{ timestamps: true }
);

// soft delete
BadWordSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
BadWordSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('BadWord', BadWordSchema);
