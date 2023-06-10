const mongoose = require('mongoose');

async function connect() {
	try {
		mongoose.set('strictQuery', false);
		mongoose.connect(process.env.MONGO_URI_ONLINE, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log(`Connected to database successfully`);
	} catch (error) {
		console.log(`Connect fail!! ${error.message}`);
	}
}

module.exports = { connect };
