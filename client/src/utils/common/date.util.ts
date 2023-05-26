import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Load plugin
dayjs.extend(relativeTime);

export const getTimeAgo = (date: Date | string, maxDateDiff = 60) => {
	const now = dayjs();
	const diff = now.diff(dayjs(date), 'day');
	if (diff > maxDateDiff) {
		return formatDate(date);
	} else {
		return dayjs(date).fromNow();
	}
};

export const formatDate = (date?: Date | string, format = DATE_FORMAT) => (date ? dayjs(date).format(format) : '');

export const DATE_FORMAT = 'DD/MM/YYYY';
