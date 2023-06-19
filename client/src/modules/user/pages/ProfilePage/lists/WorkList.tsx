import { PrivacyDropdown } from 'src/common/components/Button';
import { IPrivacy } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { Button, DatePicker, Form, Input, List, Modal, Select } from 'antd';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';
import { DATE_FORMAT, dateUtil } from '@common/utils';
import { IWork, UserType } from '@modules/user/types';
import { useUserContext } from '@modules/user/hooks';
import dayjs from 'dayjs';
import { privacyOptions } from '@assets/data';
import { SelectApi } from '@common/components/Input';
import { useFetcher } from '@common/hooks';

interface WorkModalData {
	data: IWork;
	index: number;
}

export const WorkList = () => {
	const { user, isCurrentUser } = useUserContext();
	const { updateAuthUser } = useAuth();
	const [works, setWorks] = useState(user.work);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState<WorkModalData | null>(null);

	const openModal = (data?: WorkModalData) => {
		setModalOpen(true);
		setModalData(data || null);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalData(null);
	};

	const optimisticUpdate = async (newWorks: IWork[], updateNotify: string) => {
		// Check is current user
		if (!isCurrentUser) return;

		// Save rollback point
		const prev = [...works];

		// Optimistic update
		setWorks(newWorks);

		try {
			// Update profile
			await updateAuthUser({ work: newWorks });

			// Notify
			toast.success(`${updateNotify} thành công!`);
		} catch (error: any) {
			// Rollback
			setWorks(prev);

			// Notify
			toast.error(`${updateNotify} thất bại! ${error.message || error}`);
		}
	};

	const handleCreate = (data: IWork) => optimisticUpdate([...works, data], 'Thêm liên hệ');

	const handleUpdate = async (data: IWork, index: number) => {
		const newWork = [...works];
		newWork[index] = data;
		await optimisticUpdate(newWork, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = async (data: IWork) => {
		if (modalData?.index !== undefined) {
			await handleUpdate(data, modalData.index);
		} else {
			await handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index: number) => {
		const newWork = [...works];
		newWork.splice(index, 1);
		await optimisticUpdate(newWork, 'Xóa liên hệ');
	};

	const handlePrivacyChange = async (value: IPrivacy, index: number) => {
		const newWorks = [...works];
		newWorks[index].privacy = value;
		await optimisticUpdate(newWorks, 'Thay đổi quyền riêng tư');
	};

	return (
		<>
			<WorkModal open={modalOpen} onClose={closeModal} data={modalData?.data} onSubmit={handleModalSubmit} />

			<List
				header={
					isCurrentUser && (
						<Button icon={<HiPlus />} onClick={() => openModal()}>
							Thêm mới
						</Button>
					)
				}
				bordered
				dataSource={works}
				renderItem={(work, index) => {
					const actions = [];
					if (isCurrentUser) {
						actions.push(
							<PrivacyDropdown
								key="privacy"
								value={work.privacy}
								onChange={(value) => handlePrivacyChange(value, index)}
							/>,
							<Button
								key="edit"
								type="text"
								icon={<HiPencil />}
								onClick={() => openModal({ data: work, index })}
							/>,
							<Button key="delete" type="text" icon={<HiTrash />} onClick={() => handleDelete(index)} />
						);
					}

					return (
						<List.Item actions={actions}>
							<List.Item.Meta
								title={
									<>
										Công ty: <b>{work.company}</b>
									</>
								}
								description={
									<>
										Chức vụ: <b>{work.position}</b>
									</>
								}
								style={{ width: '100%' }}
							/>
							<i>
								{[
									work.from && `Từ ${dateUtil.formatDate(work.from)}`,
									work.to && `Đến ${dateUtil.formatDate(work.to)}`,
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
	data?: IWork;
	onSubmit: (data: IWork) => any;
}

const defaultValues: IWork = {
	company: '',
	position: '',
	from: dayjs().toISOString(),
	to: undefined,
	privacy: {
		value: 'public',
	},
};

function WorkModal({ open, onClose, data, onSubmit }: ModalProps) {
	const [form] = Form.useForm<IWork>();

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
			title={data ? 'Chỉnh sửa thông tin công việc' : 'Thêm thông tin công việc'}
			okText={data ? 'Lưu' : 'Thêm'}
			onOk={form.submit}
			cancelText="Hủy"
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
