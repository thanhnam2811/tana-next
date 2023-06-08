import { Form, FormInstance, Input, Upload } from 'antd';
import { ReportFormType } from '../types';

interface Props {
	form: FormInstance<ReportFormType>;
}

export function ReportForm({ form }: Props) {
	const onFinish = (values: ReportFormType) => {
		console.log(values);
	};

	return (
		<Form form={form} layout="vertical" name="report-form" onFinish={onFinish}>
			<Form.Item name="reason" label="Lý do">
				<Input placeholder="Nhập lý do" />
			</Form.Item>

			<Form.Item name="description" label="Mô tả">
				<Input.TextArea placeholder="Nhập mô tả" autoSize={{ minRows: 3, maxRows: 5 }} />
			</Form.Item>

			<Form.Item name="images" label="Hình ảnh mô tả">
				<Upload listType="picture-card" maxCount={3} accept="image/*">
					<div>Chọn ảnh</div>
				</Upload>
			</Form.Item>
		</Form>
	);
}
