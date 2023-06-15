import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Load plugin
dayjs.extend(relativeTime);

export const DATE_FORMAT = 'DD/MM/YYYY';

export const dateUtil = {
	formatDate: (date?: Date | string, format = DATE_FORMAT) => (date ? dayjs(date).format(format) : ''),

	getTimeAgo: (date: Date | string, maxDateDiff = 60) => {
		const now = dayjs();
		const diff = now.diff(dayjs(date), 'day');
		if (!maxDateDiff || diff > maxDateDiff) {
			return dateUtil.formatDate(date);
		} else {
			return dayjs(date).fromNow();
		}
	},
};
