import { DropzoneOptions } from 'react-dropzone';

export interface IConversationConfig {
	maxFileSizeBytes: number;
	dropzone: DropzoneOptions;
}
