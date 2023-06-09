import { App, Form, Input, Upload } from 'antd';
import { ReportFormType, ReportVariant } from '../types';
import { uploadFileApi } from '@common/api';

const labelReportVariant: Record<ReportVariant, string> = {
	bug: 'Báo cáo lỗi',
	comment: 'Báo cáo bình luận',
	post: 'Báo cáo bài viết',
	conversation: 'Báo cáo cuộc trò chuyện',
	user: 'Báo cáo người dùng',
};

interface Props {
	type: ReportVariant;
}

export function useReport({ type }: Props) {
	const { modal } = App.useApp();
	const [form] = Form.useForm<ReportFormType>();

	const onFinish = async (values: ReportFormType) => {
		console.log(values);
	};

	const openReport = () =>
		modal.warning({
			title: labelReportVariant[type],
			content: (
				<Form form={form} layout="vertical" name="report-form" onFinish={onFinish}>
					<Form.Item name="reason" label="Lý do">
						<Input placeholder="Nhập lý do" />
					</Form.Item>

					<Form.Item name="description" label="Mô tả">
						<Input.TextArea placeholder="Nhập mô tả" autoSize={{ minRows: 3, maxRows: 5 }} />
					</Form.Item>

					<Form.Item name="images" label="Hình ảnh mô tả" shouldUpdate>
						<Upload
							listType="picture-card"
							maxCount={3}
							accept="image/*"
							action={async (file) => {
								const data = await uploadFileApi([file]);
								return data.files[0]._id;
							}}
						>
							{form.getFieldValue('files')?.length === 3 ? null : '+ Thêm ảnh'}
						</Upload>
					</Form.Item>
				</Form>
			),
			onOk: () => form.submit(),
		});

	return { openReport };
}
