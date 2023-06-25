import { PageTableBase } from '@common/components/PageTableBase';
import { ColumnType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import { ReportType } from '@modules/report/types';
import { Typography } from 'antd';
import { ReportStatusTag } from '@modules/report/components';
import { ReportTypeTag } from '@modules/report/components/ReportTypeTag.tsx';

const columns: ColumnType<ReportType>[] = [
	{
		key: 'type',
		title: 'Loại',
		dataIndex: 'type',
		render: (type: ReportType['type']) => <ReportTypeTag type={type} />,
	},
	{
		key: 'status',
		title: 'Trạng thái',
		dataIndex: 'status',
		render: (status: ReportType['status']) => <ReportStatusTag status={status} />,
		width: 120,
	},
	{
		key: 'content',
		title: 'Nội dung',
		dataIndex: 'description',
		render: (description: ReportType['description'], { reporter, title }) => (
			<Typography>
				<Typography.Title level={5}>
					<b>Tiêu đề:</b> {title}
				</Typography.Title>

				<Typography.Paragraph>
					<b>Người báo cáo: </b>

					<Link to={`/account/user/${reporter._id}`} onClick={(e) => e.stopPropagation()}>
						{reporter.fullname}
					</Link>
				</Typography.Paragraph>

				<Typography.Paragraph ellipsis={{ rows: 4 }} style={{ textAlign: 'justify' }}>
					<b>Mô tả:</b> {description}
				</Typography.Paragraph>
			</Typography>
		),
	},
];

export default function ReportPage() {
	const navigate = useNavigate();

	return (
		<PageTableBase<ReportType>
			header="Báo cáo"
			endpoint="/reports"
			columns={columns}
			onRow={(record) => ({
				style: { cursor: 'pointer' },
				onClick: () => navigate(`/report/${record._id}`),
			})}
		/>
	);
}
