import { contactOptions } from '@assets/data';
import { PrivacyDropdown } from '@components/Button';
import { InfoModal } from '@components/Modal/InfoModal';
import { IContact, IPrivacy } from '@interfaces';
import { useUserStore } from '@store';
import { Button, List } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi2';

interface ContactListProps {
	contacts: IContact[];
	isCurrentUser: boolean;
}

interface ContactModalData {
	data: IContact;
	index: number;
}

export const ContactList = ({ contacts: init, isCurrentUser }: ContactListProps) => {
	const { updateProfile } = useUserStore();
	const [contacts, setContacts] = useState(init);

	const [modalOpen, setModalOpen] = useState(false);
	const [modalData, setModalData] = useState<ContactModalData | null>(null);

	const openModal = (data?: ContactModalData) => {
		setModalOpen(true);
		setModalData(data || null);
	};

	const closeModal = () => {
		setModalOpen(false);
		setModalData(null);
	};

	const optimisticUpdate = async (newContacts: IContact[], updateNotify: string) => {
		// Check is current user
		if (!isCurrentUser) return;

		// Save rollback point
		const prev = [...contacts];

		// Optimistic update
		setContacts(newContacts);

		try {
			// Update profile
			await updateProfile({ contact: newContacts });

			// Notify
			toast.success(`${updateNotify} thành công!`);
		} catch (error: any) {
			// Rollback
			setContacts(prev);

			// Notify
			toast.error(`${updateNotify} thất bại! ${error.message || error}`);
		}
	};

	const handleCreate = (data: IContact) => optimisticUpdate([...contacts, data], 'Thêm liên hệ');

	const handleUpdate = async (data: IContact, index: number) => {
		const newContact = [...contacts];
		newContact[index] = data;
		optimisticUpdate(newContact, 'Cập nhật liên hệ');
	};

	const handleModalSubmit = (data: IContact) => {
		if (modalData?.index !== undefined) {
			handleUpdate(data, modalData.index);
		} else {
			handleCreate(data);
		}

		closeModal();
	};

	const handleDelete = async (index: number) => {
		const newContact = [...contacts];
		newContact.splice(index, 1);
		optimisticUpdate(newContact, 'Xóa liên hệ');
	};

	const handlePrivacyChange = async (value: IPrivacy, index: number) => {
		const newContact = [...contacts];
		newContact[index].privacy = value;
		optimisticUpdate(newContact, 'Thay đổi quyền riêng tư');
	};

	return (
		<>
			<InfoModal.Contact
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
				dataSource={contacts}
				renderItem={(contact, index) => {
					const actions = [];
					if (isCurrentUser) {
						actions.push(
							<PrivacyDropdown
								key="privacy"
								value={contact.privacy}
								onChange={(value) => handlePrivacyChange(value, index)}
							/>,
							<Button
								key="edit"
								type="text"
								icon={<HiPencil />}
								onClick={() => openModal({ data: contact, index })}
							/>,
							<Button key="delete" type="text" icon={<HiTrash />} onClick={() => handleDelete(index)} />
						);
					}

					const title = contactOptions.find((option) => option.value === contact.type)?.label;

					return (
						<List.Item actions={actions}>
							<List.Item.Meta title={title} description={contact.value} style={{ width: '100%' }} />
						</List.Item>
					);
				}}
			/>
		</>
	);
};
