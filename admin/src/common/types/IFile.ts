import { IData } from '@common/types/common';

export interface IFileUploadResponse {
	message: string;
	files: IFile[];
}

export interface IFile extends IData {
	name: string;
	originalname: string;

	link: string;
	type: string;
	size: number;

	public_id?: string;
	is_System?: boolean;
	creator?: string;
}
