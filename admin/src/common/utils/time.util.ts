import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timeUtil = {
	getTimeAgo: (time: string) => dayjs(time).fromNow(),

	formatDate: (time: string, format = 'DD/MM/YYYY') => dayjs(time).format(format),
};
