import queryString from 'query-string';

export const urlUtil = {
	getFullUrl: (url: string) => {
		if (url.startsWith('http')) return url;

		if (url.startsWith('/')) return `${process.env.BASE_URL}${url}`;

		return `${process.env.BASE_URL}/${url}`;
	},

	/** URL generator */
	generateUrl: (url: string, params: object) => `${url}?${queryString.stringify(params)}`,

	/** Placeholder Image */
	getPlaceholderImage: ({ width = 0, height = 0, text = '' }) =>
		`https://via.placeholder.com/${width}x${height}?text=${text}`,
};
