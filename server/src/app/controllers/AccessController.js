const Access = require('../models/Access');
const moment = require('moment');

class AccessController {
    //Update access of user in day when user connect on socket
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

    async dailyAccessSevenDaysAgo() {
        try {
            //get Daily access 7 days ago
            const access = await Access.find({
                day: {
                    $gte: moment().subtract(7, 'days').startOf('day').toDate(), // start of 7 days ago
                    $lte: moment().subtract(1, 'days').endOf('day').toDate(), // end of 1 day ago
                },
                sort: { day: -1 },
            });

            const dailyAccess = [];
            for (let i = 0; i < 7; i++) {
                const day = moment().subtract(7 - i, 'days').toDate(); // get day i days ago
                dailyAccess.push({
                    day: day,
                    totalAccess: access[i] ? access[i].totalAccess : 0,
                });
            }

            return dailyAccess;
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
