import { PrivacyDropdown } from '@components/Button';
import { InfoModal } from '@components/Modal/InfoModal';
import { IEducation } from '@interfaces';
import { useUserStore } from '@store';
import { formatDate } from '@utils/common';
import { Button, List } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';

interface EducationListProps {
	educations: IEducation[];
	isCurrentUser: boolean;
}

interface EducationModalData {
	data: IEducation;
	index: number;
}

export const EducationList = ({ educations: init, isCurrentUser }: EducationListProps) => {
	const { updateProfile } = useUserStore();
	const [educations, setEducations] = useState(init);

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
			await updateProfile({ education: newEducations });

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
		optimisticUpdate(newEducation, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = (data: IEducation) => {
		console.log(data);

		if (modalData?.index !== undefined) {
			handleUpdate(data, modalData.index);
		} else {
			handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index: number) => {
		const newEducation = [...educations];
		newEducation.splice(index, 1);
		optimisticUpdate(newEducation, 'Xóa liên hệ');
	};

	return (
		<>
			<InfoModal.Education
				open={modalOpen}
				onClose={closeModal}
				data={modalData?.data}
				onSubmit={handleModalSubmit}
			/>

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
				renderItem={(edu, index) => (
					<List.Item
						actions={[
							<PrivacyDropdown key="privacy" value={edu.privacy.value} />,
							<Button
								key="edit"
								type="text"
								icon={<HiPencil />}
								onClick={() => openModal({ data: edu, index })}
							/>,
							<Button key="delete" type="text" icon={<HiTrash />} onClick={() => handleDelete(index)} />,
						]}
					>
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
							{[edu.from && `Từ ${formatDate(edu.from)}`, edu.to && `Đến ${formatDate(edu.to)}`]
								.filter(Boolean)
								.join(' - ')}
						</i>
					</List.Item>
				)}
			/>
		</>
	);
};