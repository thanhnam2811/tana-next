const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ListSchema = new mongoose.Schema({
	key: {
		type: String,
		require: true,
		unique: true,
		index: true,
	},
	name: {
		type: String,
		require: true,
	},
	items: {
		type: [String],
		default: [],
	},
	isPrivate: {
		type: Boolean,
		default: false,
	},
});

// soft delete
ListSchema.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });

// paginate
ListSchema.plugin(mongoosePaginate);

const List = mongoose.model('List', ListSchema);
module.exports = List;
