import dayjs from 'dayjs';

export const randomUtil = {
	string: (length = 10) => (dayjs().valueOf() * Math.random()).toString(36).substring(0, length),

	number: (start: number, end: number) => start + Math.floor(Math.random() * (end - start)),

	boolean: () => Math.random() >= 0.5,
};
