const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const AlbumSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			require: true,
		},
		media: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'File',
				default: [],
			},
		],
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{ timestamps: true }
);

// soft delete
AlbumSchema.plugin(mongooseDelete, {
	deletedAt: true,
	overrideMethods: 'all',
});

// paginate
AlbumSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Album', AlbumSchema);
