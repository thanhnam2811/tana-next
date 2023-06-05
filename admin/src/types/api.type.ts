export interface IPaginationResponse<T> {
	items: T[];
	totalItems: number;
	currentPage: number;
	totalPages: number;
	offset: number;
}

export interface IPaginationParams {
	page: number;
	size: number;
}
