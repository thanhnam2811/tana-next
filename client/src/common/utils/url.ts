export const urlUtil = {
	getFullUrl: (url: string) => {
		if (url.startsWith('http')) return url;
		return `${process.env.BASE_URL}${url}`;
	},
};
