import { PageTableBase } from '@common/components/PageTableBase';
import { ColumnType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import { ReportType } from '@modules/report/types';
import { Image, Typography } from 'antd';
import { StatusTag } from '@modules/report/components';

const columns: ColumnType<ReportType>[] = [
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
	{
		key: 'images',
		title: 'Hình ảnh',
		dataIndex: 'images',
		render: (images: ReportType['images']) => (
			<Image.PreviewGroup>
				{images?.map((image) => (
					<Image key={image._id} width={100} height={100} src={image.link} />
				))}
			</Image.PreviewGroup>
		),
	},
	{
		key: 'status',
		title: 'Trạng thái',
		dataIndex: 'status',
		render: (status: ReportType['status']) => <StatusTag status={status} />,
		width: 120,
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
