import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';
import queryString from 'query-string';

interface searchOptions {
	normalize?: boolean;
	ignoreCase?: boolean;
}

export const stringUtil = {
	/** Get short name from full name (ex: 'Nguyen Van A' => 'VA') */
	getShortName: (name?: string) => {
		if (!name) return '';
		const nameArr = name.split(' ');
		return nameArr
			.map((n) => n[0])
			.join('')
			.slice(-2);
	},

	/** Render HTML string to React component */
	renderHTML: (html: string) => {
		const clean = sanitizeHtml(html);

		return parse(clean);
	},

	/** Remove all accents from string */
	normalize: (str: string) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),

	/** Check if string contains search string */
	search: (str: string, search: string, { normalize, ignoreCase }: searchOptions) => {
		if (normalize) {
			str = stringUtil.normalize(str);
			search = stringUtil.normalize(search);
		}

		if (ignoreCase) {
			str = str.toLowerCase();
			search = search.toLowerCase();
		}

		return str.includes(search);
	},

	/** URL generator */
	generateUrl: (url: string, params: object) => `${url}?${queryString.stringify(params)}`,
};
