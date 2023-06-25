import { ReportType } from '@modules/report/types';
import { Tag, TagProps } from 'antd';

const statusMap: Record<
	ReportType['status'],
	{
		color: TagProps['color'];
		label: string;
	}
> = {
	pending: {
		color: 'warning',
		label: 'Đang chờ',
	},
	approved: {
		color: 'success',
		label: 'Đã duyệt',
	},
	rejected: {
		color: 'error',
		label: 'Đã từ chối',
	},
};

interface Props {
	status: ReportType['status'];
}

export function StatusTag({ status, ...props }: Props & TagProps) {
	const { color, label } = statusMap[status];

	return (
		<Tag color={color} {...props}>
			{label}
		</Tag>
	);
}
