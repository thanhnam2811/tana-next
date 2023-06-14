import queryString from 'query-string';

export const urlUtil = {
	getFullUrl: (url: string) => {
		if (url.startsWith('http')) return url;
		return `${process.env.BASE_URL}${url}`;
	},

	/** URL generator */
	generateUrl: (url: string, params: object) => `${url}?${queryString.stringify(params)}`,
};