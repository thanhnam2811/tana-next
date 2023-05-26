import { contactOptions, privacyOptions } from '@assets/data';
import { IContact, IEducation, IWork } from '@interfaces';
import { DATE_FORMAT, formatDate } from '@utils/common';
import { Button, DatePicker, Form, Input, Modal, Select, Space } from 'antd';
import dayjs from 'dayjs';
import React from 'react';

interface InfoModalProps<T> {
	open: boolean;
	onClose: () => any;
	data?: T;
	onSubmit: (data: T) => any;
}

const defaultValues: {
	contact: IContact;
	work: IWork;
	education: IEducation;
} = {
	contact: {
		type: 'phone',
		value: '',
		privacy: {
			value: 'public',
		},
	},

	work: {
		company: '',
		position: '',
		from: dayjs().toISOString(),
		to: undefined,
		privacy: {
			value: 'public',
		},
	},

	education: {
		school: '',
		type: 'university',
		major: '',
		degree: '',
		from: dayjs().toISOString(),
		privacy: {
			value: 'public',
		},
	},
};

export const InfoModal = {
	Contact: function Contact({ open, onClose, data, onSubmit }: InfoModalProps<IContact>) {
		const [form] = Form.useForm<IContact>();

		React.useEffect(() => {
			if (open) {
				if (!data) form.setFieldsValue(defaultValues.contact);
				else form.setFieldsValue(data);
			}
		}, [open, data]);

		return (
			<Modal
				open={open}
				onCancel={onClose}
				title={data ? 'Chỉnh sửa thông tin liên hệ' : 'Thêm thông tin liên hệ'}
				footer={
					<Space>
						<Button onClick={onClose}>Hủy</Button>
						<Button type="primary" onClick={() => form.submit()}>
							{data ? 'Lưu' : 'Thêm'}
						</Button>
					</Space>
				}
			>
				<Form form={form} onFinish={onSubmit} layout="vertical">
					<Form.Item
						name="type"
						label="Loại liên hệ"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn loại liên hệ!',
							},
						]}
					>
						<Select options={contactOptions} />
					</Form.Item>

					<Form.Item
						name="value"
						label="Giá trị"
						dependencies={['type']}
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập giá trị!',
							},
							({ getFieldValue }) => {
								const type = getFieldValue('type');

								if (type === 'phone') {
									return {
										pattern: /^0[0-9]{9}$/,
										message: 'Số điện thoại không hợp lệ!',
									};
								}

								if (type === 'email') {
									return {
										type: 'email',
										message: 'Email không hợp lệ!',
									};
								}

								return {
									type: 'url',
									message: 'URL không hợp lệ!',
								};
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name={['privacy', 'value']}
						label="Quyền riêng tư"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn quyền riêng tư!',
							},
						]}
					>
						<Select options={privacyOptions} />
					</Form.Item>
				</Form>
			</Modal>
		);
	},

	Work: function Work({ open, onClose, data, onSubmit }: InfoModalProps<IWork>) {
		const [form] = Form.useForm<IWork>();

		React.useEffect(() => {
			if (open) {
				if (!data) form.setFieldsValue(defaultValues.work);
				else form.setFieldsValue(data);
			}
		}, [open, data]);

		return (
			<Modal
				open={open}
				onCancel={onClose}
				title={data ? 'Chỉnh sửa thông tin công việc' : 'Thêm thông tin công việc'}
				footer={
					<Space>
						<Button onClick={onClose}>Hủy</Button>
						<Button type="primary" onClick={() => form.submit()}>
							{data ? 'Lưu' : 'Thêm'}
						</Button>
					</Space>
				}
			>
				<Form form={form} onFinish={onSubmit} layout="vertical">
					<Form.Item
						name="company"
						label="Công ty"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập tên công ty!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="position"
						label="Vị trí"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập vị trí!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item
						name="from"
						label="Ngày bắt đầu"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập ngày bắt đầu!',
							},
						]}
						getValueProps={(value) => ({ value: value && dayjs(value) })}
					>
						<DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name="to"
						label="Ngày kết thúc"
						getValueProps={(value) => ({ value: value && dayjs(value) })}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									const from = getFieldValue('from');

									if (!value) return Promise.resolve();

									if (from && value.isBefore(from)) {
										return Promise.reject('Ngày kết thúc không hợp lệ!');
									}

									return Promise.resolve();
								},
							}),
						]}
					>
						<DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name={['privacy', 'value']}
						label="Quyền riêng tư"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn quyền riêng tư!',
							},
						]}
					>
						<Select options={privacyOptions} />
					</Form.Item>
				</Form>
			</Modal>
		);
	},

	Education: function Education({ open, onClose, data, onSubmit }: InfoModalProps<IEducation>) {
		const [form] = Form.useForm<IEducation>();

		React.useEffect(() => {
			if (open) {
				if (!data) form.setFieldsValue(defaultValues.education);
				else form.setFieldsValue(data);
			}
		}, [open, data]);

		return (
			<Modal
				open={open}
				onCancel={onClose}
				title={data ? 'Chỉnh sửa thông tin học vấn' : 'Thêm thông tin học vấn'}
				footer={
					<Space>
						<Button onClick={onClose}>Hủy</Button>
						<Button type="primary" onClick={() => form.submit()}>
							{data ? 'Lưu' : 'Thêm'}
						</Button>
					</Space>
				}
			>
				<Form form={form} onFinish={onSubmit} layout="vertical">
					<Form.Item
						name="school"
						label="Trường"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập tên trường!',
							},
						]}
					>
						<Input />
					</Form.Item>

					<Form.Item name="major" label="Chuyên ngành">
						<Input />
					</Form.Item>

					<Form.Item name="degree" label="Bằng cấp">
						<Input />
					</Form.Item>

					<Form.Item
						name="from"
						label="Ngày bắt đầu"
						rules={[
							{
								required: true,
								message: 'Vui lòng nhập ngày bắt đầu!',
							},
						]}
						getValueProps={(value) => ({ value: value && dayjs(value) })}
					>
						<DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name="to"
						label="Ngày kết thúc"
						getValueProps={(value) => ({ value: value && dayjs(value) })}
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									const from = getFieldValue('from');

									if (!value) return Promise.resolve();

									if (from && value.isBefore(from)) {
										return Promise.reject('Ngày kết thúc không hợp lệ!');
									}

									return Promise.resolve();
								},
							}),
						]}
					>
						<DatePicker format={DATE_FORMAT} style={{ width: '100%' }} />
					</Form.Item>

					<Form.Item
						name={['privacy', 'value']}
						label="Quyền riêng tư"
						rules={[
							{
								required: true,
								message: 'Vui lòng chọn quyền riêng tư!',
							},
						]}
					>
						<Select options={privacyOptions} />
					</Form.Item>
				</Form>
			</Modal>
		);
	},
};
