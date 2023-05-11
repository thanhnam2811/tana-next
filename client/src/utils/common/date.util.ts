import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Load plugin
dayjs.extend(relativeTime);

export const getTimeAgo = (date: Date | string, maxDateDiff = 60) => {
	const now = dayjs();
	const diff = now.diff(dayjs(date), 'day');
	if (diff > maxDateDiff) {
		return dayjs(date).format('DD/MM/YYYY');
	} else {
		return dayjs(date).fromNow();
	}
};
