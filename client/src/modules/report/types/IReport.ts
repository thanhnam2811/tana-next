import { IData, MediaType } from '@common/types';
import { RcFile } from 'antd/lib/upload';

export type ReportTypeValue = 'user' | 'post' | 'comment' | 'conversation' | 'bug';

interface IReport extends IData {
	title: string;
	description: string;
	images?: MediaType[] | string[];
	type: ReportTypeValue;
}

export type ReportType = IReport & { images?: MediaType[] }; // For use
export type ReportFormType = IReport & {
	images?: string[];
	files?: {
		file: RcFile & { originFileObj: File };
		fileList: (RcFile & { originFileObj: File })[];
	};
} & Partial<Record<ReportTypeValue, string>>;
