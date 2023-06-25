import { Link, Navigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { swrFetcher } from '@common/api';
import { FullscreenSpin } from '@common/components/Loading';
import { ReportType } from '@modules/report/types';
import { Button, Card, Image, message, Space, Typography } from 'antd';
import { timeUtil } from '@common/utils';
import { StatusTag } from '@modules/report/components';
import { approveReportApi } from '@modules/report/api';
import { useState } from 'react';

function ReportDetail() {
	const { id } = useParams();
	const { data: report, isLoading, error, mutate } = useSWR<ReportType, string>(`/reports/${id}`, swrFetcher);
	const [processing, setProcessing] = useState({
		approve: false,
		reject: false,
	});

	if (isLoading) return <FullscreenSpin />;

	if (error) return <div>{error || error.toString()}</div>;

	if (!report) return <Navigate to="/404" />;

	const handleApprove = async () => {
		setProcessing({ ...processing, approve: true });
		const key = 'approve';
		message.loading({ content: 'Đang duyệt báo cáo...', key });

		try {
			await approveReportApi(report._id);

			await mutate({ ...report, status: 'approved' }, false);

			message.success({ content: 'Duyệt báo cáo thành công!', key });
		} catch (error) {
			message.error({ content: `Duyệt báo cáo thất bại! ${error}`, key });
		}

		setProcessing({ ...processing, approve: false });
	};

	const handleReject = async () => {
		setProcessing({ ...processing, reject: true });
		const key = 'reject';
		message.loading({ content: 'Đang từ chối báo cáo...', key });

		try {
			await approveReportApi(report._id);

			await mutate({ ...report, status: 'rejected' }, false);

			message.success({ content: 'Từ chối báo cáo thành công!', key });
		} catch (error) {
			message.error({ content: `Từ chối báo cáo thất bại! ${error}`, key });
		}

		setProcessing({ ...processing, reject: false });
	};

	const { reporter, images } = report;

	return (
		<Card
			title="Chi tiết báo cáo"
			loading={isLoading}
			extra={
				report.status === 'pending' && (
					<Space split>
						<Button
							type="primary"
							danger
							onClick={handleReject}
							loading={processing.reject}
							disabled={processing.approve}
						>
							Từ chối
						</Button>

						<Button
							type="primary"
							onClick={handleApprove}
							loading={processing.approve}
							disabled={processing.reject}
						>
							Duyệt
						</Button>
					</Space>
				)
			}
		>
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
							<Space>
								{report.images?.map((image, index) => (
									<Image
										key={image._id}
										width={100}
										height={100}
										src={image.link}
										alt={`Ảnh đính kèm ${index + 1}`}
										style={{ objectFit: 'cover' }}
									/>
								))}
							</Space>
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
