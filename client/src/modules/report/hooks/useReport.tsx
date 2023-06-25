import { App, Form, Input, Upload } from 'antd';
import { ReportFormType, ReportTypeValue } from '../types';
import { toast } from 'react-hot-toast';
import { uploadFileApi } from '@common/api';
import { reportApi } from '@modules/report/api';

const labelReport: Record<ReportTypeValue, string> = {
	bug: 'Báo lỗi',
	comment: 'Báo cáo bình luận',
	post: 'Báo cáo bài viết',
	conversation: 'Báo cáo cuộc trò chuyện',
	user: 'Báo cáo người dùng',
};

interface Props {
	type: ReportTypeValue;
	id?: string;
}

export function useReport({ type, id }: Props) {
	const { modal } = App.useApp();
	const [form] = Form.useForm<ReportFormType>();

	const onFinish = async (values: ReportFormType) => {
		console.log({ values });

		const toastId = toast.loading('Đang gửi báo cáo...');
		try {
			const fileList = values.files?.fileList;
			if (fileList?.length) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				const { files } = await uploadFileApi(fileList.map((file) => file.originFileObj));
				values.images = files.map((file) => file._id);
			}
			delete values.files;
			values[type] = id;

			await reportApi(values);
			toast.success('Gửi báo cáo thành công!', { id: toastId });
		} catch (error: any) {
			toast.error(`Gửi báo cáo thất bại: ${error.message}!`, { id: toastId });
		}
	};

	const openReport = () =>
		modal.warning({
			title: labelReport[type],
			content: (
				<Form form={form} layout="vertical" name="report-form" onFinish={onFinish}>
					<Form.Item name="type" initialValue={type} hidden />

					<Form.Item name="title" label="Tiêu đề">
						<Input placeholder="Nhập tiêu đề" />
					</Form.Item>

					<Form.Item name="description" label="Mô tả">
						<Input.TextArea placeholder="Nhập mô tả" autoSize={{ minRows: 3, maxRows: 5 }} />
					</Form.Item>

					<Form.Item name="files" label="Hình ảnh mô tả (Tối đa 3 ảnh)" shouldUpdate>
						<Upload listType="picture-card" maxCount={3} accept="image/*">
							+ Thêm ảnh
						</Upload>
					</Form.Item>
				</Form>
			),
			onOk: () => form.submit(),
			closable: true,
			maskClosable: true,
		});

	return { openReport };
}
