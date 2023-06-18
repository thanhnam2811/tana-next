const moment = require('moment');
const Access = require('../models/Access');

class AccessController {
	// Update access of user in day when user connect on socket
	async updateAccessInDay() {
		try {
			const access = await Access.findOne({
				day: {
					$gte: moment().startOf('day').toDate(), // start of day
					$lte: moment().endOf('day').toDate(), // end of day
				},
			});

			if (access) {
				access.totalAccess += 1;
				await access.save();
			} else {
				const newAccess = new Access({
					totalAccess: 1,
				});
				await newAccess.save();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async dailyAccessSevenDaysAgo(startDay, endDay) {
		try {
			//increase endDay 1
			endDay = moment(endDay).add(1, 'days').format('YYYY-MM-DD');
			const totalAccessByDay = await Access.aggregate([
				{
					$match: {
						day: {
							$gte: new Date(startDay),
							$lte: new Date(endDay),
						},
					},
				},
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$day' } },
						totalAccess: { $sum: '$totalAccess' },
					},
				},
				{
					$sort: { _id: 1 },
				},
			]);

			// Create an object to store the total access by day
			const totalAccessMap = {};

			// Initialize the map with 0 for each day in the range
			let currentDate = new Date(startDay);
			const endDate = new Date(endDay);
			while (currentDate <= endDate - 1) {
				const dateString = currentDate.toISOString().split('T')[0];
				totalAccessMap[dateString] = 0;

				const nextDate = currentDate.setDate(currentDate.getDate() + 1);
				currentDate = new Date(nextDate);
			}

			// Update the map with the actual total access
			totalAccessByDay.forEach((result) => {
				totalAccessMap[result._id] = result.totalAccess;
			});

			// Convert the map into an array of objects
			const totalAccessByDayArray = Object.keys(totalAccessMap).map((dateString) => ({
				day: dateString,
				totalAccess: totalAccessMap[dateString],
			}));

			return totalAccessByDayArray;
		} catch (error) {
			console.log(error);
		}
	}

	async getNumAccessInDay() {
		try {
			const access = await Access.findOne({
				day: {
					$gte: moment().startOf('day').toDate(), // start of day
					$lte: moment().endOf('day').toDate(), // end of day
				},
			});
			return access ? access.totalAccess : 0;
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new AccessController();
