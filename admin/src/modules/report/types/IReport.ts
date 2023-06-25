import { IData, IMedia } from '@common/types';
import { RcFile } from 'antd/lib/upload';
import { UserType } from '@modules/user/types';

export type ReportTypeValue = 'user' | 'post' | 'comment' | 'conversation' | 'bug';

interface IReport extends IData {
	reporter: UserType;
	title: string;
	description: string;
	images?: IMedia[] | string[];
	type: ReportTypeValue;
	status: 'pending' | 'approved' | 'rejected';
}

export type ReportType = IReport & { images?: IMedia[] }; // For use
export type ReportFormType = IReport & {
	images?: string[];
	files?: {
		file: RcFile & { originFileObj: File };
		fileList: (RcFile & { originFileObj: File })[];
	};
} & Partial<Record<ReportTypeValue, string>>;
