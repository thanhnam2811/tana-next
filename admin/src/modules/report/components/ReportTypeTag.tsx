import { ReportType } from '@modules/report/types';
import { Tag, TagProps } from 'antd';

const typeMap: Record<
	ReportType['type'],
	{
		color: TagProps['color'];
		label: string;
	}
> = {
	user: {
		color: 'warning',
		label: 'Người dùng',
	},
	post: {
		color: 'success',
		label: 'Bài viết',
	},
	comment: {
		color: 'default',
		label: 'Bình luận',
	},
	conversation: {
		color: 'processing',
		label: 'Cuộc trò chuyện',
	},
	bug: {
		color: 'error',
		label: 'Lỗi',
	},
};

interface Props {
	type: ReportType['type'];
}

export function ReportTypeTag({ type, ...props }: Props & TagProps) {
	const { color, label } = typeMap[type];

	return (
		<Tag color={color} {...props}>
			{label}
		</Tag>
	);
}
