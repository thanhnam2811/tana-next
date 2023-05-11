import filesIcon from '../../assets/icons/files';

export const acceptedImageTypes = ['png', 'jpg', 'jpeg'];

export const acceptedVideoTypes = ['mp4', 'mkv'];

export const acceptedAudioTypes = ['mp3'];

export const acceptedDocumentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

export const acceptedArchiveTypes = ['zip'];

export const acceptedFileTypes = [
	...acceptedImageTypes,
	...acceptedVideoTypes,
	...acceptedAudioTypes,
	...acceptedDocumentTypes,
	...acceptedArchiveTypes,
];

export const getFilePreview: any = (file: File | any) => {
	const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/');
	if (isMedia) {
		return file.link || URL.createObjectURL(file);
	} else {
		const ext = file.name.split('.').pop();
		if (ext && Object.keys(filesIcon).includes(ext)) {
			return filesIcon[ext];
		}
		return filesIcon.def;
	}
};

export const isValidateFileType = (file: File) => {
	const ext = file.name?.split('.').pop();
	return ext && acceptedFileTypes.includes(ext);
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const isValidateFileSize = (file: File) => file.size <= MAX_FILE_SIZE;

export const isVideo = (file: File) => {
	const ext = file?.name?.split('.').pop();
	return ext && acceptedVideoTypes.includes(ext);
};

export const isImage = (file: File) => {
	const ext = file?.name?.split('.').pop();
	return ext && acceptedImageTypes.includes(ext);
};

export const getFileIcon = (file: File) => {
	const ext = file.name.split('.').pop();
	if (ext && Object.keys(filesIcon).includes(ext)) {
		return filesIcon[ext];
	}
	return filesIcon.def;
};
