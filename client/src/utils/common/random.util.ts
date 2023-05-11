import dayjs from 'dayjs';

export const randomString = (length = 10) => (dayjs().valueOf() * Math.random()).toString(36).substring(0, length);

export const randomNumber = (start: number, end: number) => start + Math.floor(Math.random() * (end - start));

export const randomBoolean = () => Math.random() >= 0.5;
