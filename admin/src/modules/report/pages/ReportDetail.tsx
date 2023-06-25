import { Link, Navigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { swrFetcher } from '@common/api';
import { FullscreenSpin } from '@common/components/Loading';
import { ReportType } from '@modules/report/types';
import { Card, Image, Typography } from 'antd';
import { timeUtil } from '@common/utils';
import { StatusTag } from '@modules/report/components';

function ReportDetail() {
	const { id } = useParams();
	const { data: report, isLoading, error } = useSWR<ReportType, string>(`/reports/${id}`, swrFetcher);

	console.log({ report, isLoading, error });

	if (isLoading) return <FullscreenSpin />;

	if (error) return <div>{error || error.toString()}</div>;

	if (!report) return <Navigate to="/404" />;

	const { reporter, images } = report;

	return (
		<Card title="Chi tiết báo cáo" loading={isLoading}>
			<Typography>
				<Typography.Title level={5}>
					<b>Tiêu đề:</b> {report.title}
				</Typography.Title>

				<Typography.Paragraph>
					<b>Người báo cáo: </b>
					<Link to={`/account/user/${reporter._id}`} onClick={(e) => e.stopPropagation()}>
						{reporter.fullname}
					</Link>
				</Typography.Paragraph>

				<Typography.Paragraph>
					<b>Thời gian: </b>
					{timeUtil.getTimeAgo(report.createdAt)}
				</Typography.Paragraph>

				<Typography.Paragraph>
					<b>Trạng thái: </b>

					<StatusTag status={report.status} />
				</Typography.Paragraph>

				<Typography.Paragraph>
					<b>Hình ảnh: </b>

					{images && images?.length > 0 ? (
						<Image.PreviewGroup>
							{report.images?.map((image) => (
								<Image key={image._id} width={100} height={100} src={image.link} />
							))}
						</Image.PreviewGroup>
					) : (
						<Typography.Text type="secondary">(Không có hình ảnh)</Typography.Text>
					)}
				</Typography.Paragraph>

				<Typography.Paragraph
					style={{ textAlign: 'justify' }}
					ellipsis={{
						rows: 8,
						expandable: true,
					}}
				>
					<b>Nội dung:</b> {report.description}
				</Typography.Paragraph>
			</Typography>
		</Card>
	);
}

export default ReportDetail;
