import doc from './doc.svg';
import pdf from './pdf.svg';
import xls from './xls.svg';
import zip from './zip.svg';
import txt from './txt.svg';
import raw from './raw.svg';
import ppt from './ppt.svg';

const files: {
	[key: string]: any;
} = {
	doc,
	docx: doc,
	pdf,
	xls,
	xlsx: xls,
	zip,
	txt,
	raw,
	ppt,
	pptx: ppt,
	def: raw,
};

export default files;
