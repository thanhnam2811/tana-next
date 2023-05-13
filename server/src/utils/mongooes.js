module.exports = {
  multipleMongooseToObject: function (mongooesArray) {
    return mongooesArray.map((mongoes) => mongoes.toObject());
  },
  MongooseToObject: function (mongooes) {
    return mongooes ? mongooes.toObject() : mongooes;
  },
};
