import { IData, IMedia } from '@common/types';

interface IReport extends IData {
	reason: string;
	description: string;
	images?: IMedia[] | string[];
}

export type ReportType = IReport & { images?: IMedia[] }; // For use
export type ReportFormType = IReport & { images?: string[] }; // For form
