import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';

export const getShortName = (name?: string) => {
	if (!name) return '';
	const nameArr = name.split(' ');
	return nameArr
		.map((n) => n[0])
		.join('')
		.slice(-2);
};

export const renderHTML = (html: string) => {
	const clean = sanitizeHtml(html);

	return parse(clean);
};
