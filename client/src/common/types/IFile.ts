export interface IFileUploadResponse {
	message: string;
	files: IFile[];
}

export interface IFile {
	name: string;
	originalname: string;
	type: string;
	link: string;
	public_id: string;
	is_System: boolean;
	creator: string;
	_id: string;
	deleted: boolean;
	createdAt: string;
	updatedAt: string;
}
