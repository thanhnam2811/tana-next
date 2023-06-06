import { PrivacyDropdown } from '@components/Button';
import { InfoModal } from '@components/Modal/InfoModal';
import { IPrivacy, IWork } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { formatDate } from '@utils/common';
import { Button, List } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';

interface WorkListProps {
	works: IWork[];
	isCurrentUser: boolean;
}

interface WorkModalData {
	data: IWork;
	index: number;
}

export const WorkList = ({ works: init, isCurrentUser }: WorkListProps) => {
	const { updateAuthUser } = useAuth();
	const [works, setWorks] = useState(init);

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
		optimisticUpdate(newWork, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = (data: IWork) => {
		if (modalData?.index !== undefined) {
			handleUpdate(data, modalData.index);
		} else {
			handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index: number) => {
		const newWork = [...works];
		newWork.splice(index, 1);
		optimisticUpdate(newWork, 'Xóa liên hệ');
	};

	const handlePrivacyChange = async (value: IPrivacy, index: number) => {
		const newWorks = [...works];
		newWorks[index].privacy = value;
		optimisticUpdate(newWorks, 'Thay đổi quyền riêng tư');
	};

	return (
		<>
			<InfoModal.Work open={modalOpen} onClose={closeModal} data={modalData?.data} onSubmit={handleModalSubmit} />

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
								{[work.from && `Từ ${formatDate(work.from)}`, work.to && `Đến ${formatDate(work.to)}`]
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
