import { fileUtil } from 'src/modules/auth/data';
import { FileError } from 'react-dropzone';
import { IConversationConfig } from '../types';

const maxFileSizeBytes = 10 * 1024 * 1024; // 10 MB
const maxFileSizeMB = maxFileSizeBytes / 1024 / 1024;

export const conversationConfig: IConversationConfig = {
	maxFileSizeBytes,
	dropzone: {
		noClick: true,
		maxSize: maxFileSizeBytes, // 10 MB
		accept: {
			'image/*': ['.jpg', '.jpeg', '.png'],
			'video/*': ['.mp4', '.mkv'],
			'audio/*': ['.mp3'],
			'application/msword': [], // .doc
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [], // .docx
			'application/vnd.ms-excel': [], // .xls
			'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // .xlsx
			'application/vnd.ms-powerpoint': [], // .ppt
			'application/vnd.openxmlformats-officedocument.presentationml.presentation': [], // .pptx
			'application/pdf': [],
			'application/zip': [],
		},
		validator: (file) => {
			// Check file type
			if (!fileUtil.isValidFileType(file.name)) {
				const error: FileError = {
					code: 'file-type-not-allowed',
					message: 'File không hợp lệ!',
				};

				return error;
			}

			// Check file size
			else if (!fileUtil.isValidFileSize(file.size)) {
				const error: FileError = {
					code: 'file-size-too-large',
					message: `File quá lớn! (Tối đa ${maxFileSizeMB} MB)`,
				};

				return error;
			}

			// return null if no error
			else return null;
		},
	},
};
