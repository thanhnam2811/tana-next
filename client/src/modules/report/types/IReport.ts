import { IData, IMedia } from '@common/types';
import { RcFile } from 'antd/es/upload';

export type ReportTypeValue = 'user' | 'post' | 'comment' | 'conversation' | 'other';

interface IReport extends IData {
	title: string;
	description: string;
	images?: IMedia[] | string[];
	type: ReportTypeValue;
}

export type ReportType = IReport & { images?: IMedia[] }; // For use
export type ReportFormType = IReport & { images?: string[]; files?: { file: RcFile; fileList: RcFile[] } } & Partial<
		Record<ReportTypeValue, string>
	>;
