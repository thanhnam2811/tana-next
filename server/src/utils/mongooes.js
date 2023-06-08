module.exports = {
	multipleMongooseToObject(mongooesArray) {
		return mongooesArray.map((mongoes) => mongoes.toObject());
	},
	MongooseToObject(mongooes) {
		return mongooes ? mongooes.toObject() : mongooes;
	},
};
