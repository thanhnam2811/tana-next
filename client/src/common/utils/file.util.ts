import filesIcon from '../../assets/icons/files';
import { IFile } from '@common/types';

const acceptedImageTypes = ['png', 'jpg', 'jpeg'];

const acceptedVideoTypes = ['mp4', 'mkv'];

const acceptedAudioTypes = ['mp3'];

const acceptedDocumentTypes = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

const acceptedArchiveTypes = ['zip'];

const acceptedFileTypes = [
	...acceptedImageTypes,
	...acceptedVideoTypes,
	...acceptedAudioTypes,
	...acceptedDocumentTypes,
	...acceptedArchiveTypes,
];

export const fileUtil = {
	acceptedImageTypes,
	acceptedVideoTypes,
	acceptedAudioTypes,
	acceptedDocumentTypes,
	acceptedArchiveTypes,
	acceptedFileTypes,

	getFilePreview: (file: File | IFile) => {
		const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/');
		if (isMedia) {
			if (file instanceof File) {
				return URL.createObjectURL(file);
			} else {
				return file.link;
			}
		} else {
			const ext = file.name.split('.').pop();
			let fileIcon = filesIcon.def;
			if (ext && Object.keys(filesIcon).includes(ext)) {
				fileIcon = filesIcon[ext];
			}

			return fileIcon.src as string;
		}
	},

	isValidFileType: (name: string) => {
		const ext = name?.split('.').pop();
		return ext && acceptedFileTypes.includes(ext);
	},
	isValidFileSize: (size: number) => {
		const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
		return size <= MAX_FILE_SIZE;
	},

	isVideo: (name: string) => {
		const ext = name?.split('.').pop();
		return ext && acceptedVideoTypes.includes(ext);
	},
	isImage: (name: string) => {
		const ext = name?.split('.').pop();
		return ext && acceptedImageTypes.includes(ext);
	},
	getFileIcon: (name: string) => {
		const ext = name.split('.').pop();
		if (ext && Object.keys(filesIcon).includes(ext)) {
			return filesIcon[ext];
		}
		return filesIcon.def;
	},
};
