import { PrivacyDropdown } from 'src/common/components/Button';
import { useAuth } from '@modules/auth/hooks';
import { Button, DatePicker, Form, Input, List, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import { DATE_FORMAT, dateUtil } from '@common/utils';
import { IEducation, UserType } from '@modules/user/types';
import { IPrivacy } from '@common/types';
import { useUserContext } from '@modules/user/hooks';
import { privacyOptions } from '@assets/data';
import dayjs from 'dayjs';
import { SelectApi } from '@common/components/Input';
import { useFetcher } from '@common/hooks';

interface EducationModalData {
	data: IEducation;
	index: number;
}

export const EducationList = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();
	const [educations, setEducations] = useState(user.education);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState<EducationModalData | null>(null);

	const openModal = (data?: EducationModalData) => {
		setModalOpen(true);
		setModalData(data || null);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalData(null);
	};

	const optimisticUpdate = async (newEducations: IEducation[], updateNotify: string) => {
		// Check is current user
		if (!isCurrentUser) return;

		// Save rollback point
		const prev = [...educations];

		// Optimistic update
		setEducations(newEducations);

		try {
			// Update profile
			await updateAuthUser({ education: newEducations });

			// Notify
			toast.success(`${updateNotify} thành công!`);
		} catch (error: any) {
			// Rollback
			setEducations(prev);

			// Notify
			toast.error(`${updateNotify} thất bại! ${error.message || error}`);
		}
	};

	const handleCreate = (data: IEducation) => optimisticUpdate([...educations, data], 'Thêm liên hệ');

	const handleUpdate = async (data: IEducation, index: number) => {
		const newEducation = [...educations];
		newEducation[index] = data;
		await optimisticUpdate(newEducation, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = async (data: IEducation) => {
		if (modalData?.index !== undefined) {
			await handleUpdate(data, modalData.index);
		} else {
			await handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index: number) => {
		const newEducation = [...educations];
		newEducation.splice(index, 1);
		await optimisticUpdate(newEducation, 'Xóa liên hệ');
	};

	const handlePrivacyChange = async (value: IPrivacy, index: number) => {
		const newEdu = [...educations];
		newEdu[index].privacy = value;
		await optimisticUpdate(newEdu, 'Thay đổi quyền riêng tư');
	};

	return (
		<>
			<EducationModal open={modalOpen} onClose={closeModal} data={modalData?.data} onSubmit={handleModalSubmit} />

			<List
				header={
					isCurrentUser && (
						<Button icon={<HiPlus />} onClick={() => openModal()}>
							Thêm mới
						</Button>
					)
				}
				bordered
				dataSource={educations}
				renderItem={(edu, index) => {
					const actions = [];
					if (isCurrentUser) {
						actions.push(
							<PrivacyDropdown
								key="privacy"
								value={edu.privacy}
								onChange={(value) => handlePrivacyChange(value, index)}
							/>,
							<Button
								key="edit"
								type="text"
								icon={<HiPencil />}
								onClick={() => openModal({ data: edu, index })}
							/>,
							<Button key="delete" type="text" icon={<HiTrash />} onClick={() => handleDelete(index)} />
						);
					}

					return (
						<List.Item actions={actions}>
							<List.Item.Meta
								title={
									<>
										Trường: <b>{edu.school}</b>
									</>
								}
								description={
									<>
										Chuyên ngành:{' '}
										<b>
											{edu.major} ({edu.degree})
										</b>
									</>
								}
								style={{ width: '100%' }}
							/>
							<i>
								{[
									edu.from && `Từ ${dateUtil.formatDate(edu.from)}`,
									edu.to && `Đến ${dateUtil.formatDate(edu.to)}`,
								]
									.filter(Boolean)
									.join(' - ')}
							</i>
						</List.Item>
					);
				}}
			/>
		</>
	);
};

interface ModalProps {
	open: boolean;
	onClose: () => any;
	data?: IEducation;
	onSubmit: (data: IEducation) => any;
}

const defaultValues: IEducation = {
	school: '',
	type: 'university',
	major: '',
	degree: '',
	from: dayjs().toISOString(),
	privacy: {
		value: 'public',
	},
};

function EducationModal({ open, onClose, data, onSubmit }: ModalProps) {
	const [form] = Form.useForm<IEducation>();

	React.useEffect(() => {
		if (open) {
			if (!data) form.setFieldsValue(defaultValues);
			else form.setFieldsValue(data);
		}
	}, [open, data]);

	const friendFetcher = useFetcher<UserType>({ api: `/users/searchUser/friends` });
	const privacyValue = Form.useWatch(['privacy', 'value'], form);

	return (
		<Modal
			open={open}
			onCancel={onClose}
			title={data ? 'Chỉnh sửa thông tin học vấn' : 'Thêm thông tin học vấn'}
			okText={data ? 'Lưu' : 'Thêm'}
			onOk={form.submit}
			cancelText="Hủy"
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

				{privacyValue === 'includes' && (
					<Form.Item
						name={['privacy', 'includes']}
						label="Bao gồm"
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'includes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>
				)}

				{privacyValue === 'excludes' && (
					<Form.Item
						name={['privacy', 'excludes']}
						label="Trừ ra"
						rules={[
							({ getFieldValue }) => ({
								validator(_, value) {
									if (getFieldValue('value') === 'excludes' && value?.length === 0) {
										return Promise.reject(new Error('Vui lòng chọn người dùng'));
									}
									return Promise.resolve();
								},
							}),
						]}
					>
						<SelectApi
							mode="multiple"
							fetcher={friendFetcher}
							toOption={(u) => ({ label: u.fullname, value: u._id })}
						/>
					</Form.Item>
				)}
			</Form>
		</Modal>
	);
}
