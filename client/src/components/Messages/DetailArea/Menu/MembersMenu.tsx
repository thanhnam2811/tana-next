import { AvatarBadge } from '@components/MUI/AvatarBadge';
import { ConversationMembersModal, ConversationModal } from '@components/Modal';
import { useUserStore } from '@store';
import { Avatar } from '@mui/material';
import { MessageContext } from '@pages/messages/[id]';
import { UpdateMembersType, conversationApi } from '@utils/api';
import { getShortName } from '@utils/common';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FiUserPlus } from 'react-icons/fi';
import { Menu, MenuOptionProps } from '../components';

export function MembersMenu() {
	const { user: currentUser } = useUserStore();
	const { conversation, isDirect, updateConversation, convFetcher } = useContext(MessageContext)!;
	const router = useRouter();

	const [modalData, setModalData] = useState<{
		member?: any;
	}>({});
	const [openModal, setOpenModal] = useState<'add' | 'member' | null>(null);
	const closeModal = () => setOpenModal(null);

	const openModalAdd = () => setOpenModal('add');
	const handleSubmitModalAdd = async (listMember: any) => {
		try {
			// Create new conversation if direct
			if (isDirect) {
				// call api
				const members = [
					...conversation.members.map((m: any) => m.user), // add old members
					...listMember, // add new members
				];

				const data = {
					members: members.map((m: any) => ({ user: m._id })),
					name: members.map((m: any) => m.fullname).join(', '),
				};
				// Update to server
				const res = await conversationApi.create(data);
				const newConv = res.data;

				// Add new conversation to list
				convFetcher?.addData(newConv);

				// Go to new conversation
				router.push(`/messages/${newConv._id}`);

				// Show toast
				toast.success('Tạo cuộc trò chuyện thành công!');
			}

			// Add member to conversation if group
			else {
				// Update to server
				const res = await conversationApi.addMembers(
					conversation._id,
					listMember.map((m: any) => ({ user: m._id }))
				);
				const newConv = res.data;

				// Update UI
				updateConversation(newConv);

				// Show toast
				toast.success('Thêm thành viên thành công!');
			}
		} catch (error: any) {
			// Show toast
			toast.error(error.toString() || 'Thêm thành viên thất bại!');
		}
	};

	const openModalMember = (member: any) => {
		setModalData({ member });
		setOpenModal('member');
	};
	const handleUpdateMembers = async (type: UpdateMembersType, data: any) => {
		// Update to server
		const res = await conversationApi.updateMember(conversation._id, type, data);
		const newConv = res.data;
		updateConversation(newConv);

		// Find member in new conversation
		const member = newConv.members.find((m: any) => m.user._id === data.userID);
		if (member) setModalData({ member });
	};

	const menuOptions: MenuOptionProps[] = [
		...conversation.members.map((member: any) => {
			const { user, nickname, addedBy, addedAt, isOnline } = member;
			return {
				Icon: () => (
					<AvatarBadge active={isOnline}>
						<Avatar
							src={user.profilePicture?.link}
							alt={user.fullname}
							sx={{
								width: 40,
								height: 40,
							}}
						>
							{getShortName(user.fullname)}
						</Avatar>
					</AvatarBadge>
				),
				label: nickname || user.fullname + (user._id === currentUser?._id ? ' (Bạn)' : ''),
				subLabel: (
					<>
						Thêm bời <b>{addedBy.fullname}</b> vào <b>{dayjs(addedAt).format('DD/MM/YYYY')}</b>
					</>
				),
				onClick: () => openModalMember(member),
			};
		}),
		// Add member
		{
			Icon: FiUserPlus,
			label: isDirect ? 'Tạo nhóm mới với người này' : 'Thêm thành viên',
			onClick: openModalAdd,
		},
	];

	return (
		<>
			<Menu label="Thành viên" options={menuOptions} />

			<ConversationMembersModal
				open={openModal === 'member'}
				onClose={closeModal}
				member={modalData.member}
				handleUpdateMembers={handleUpdateMembers}
			/>

			<ConversationModal
				open={openModal === 'add'}
				handleClose={closeModal}
				handleSubmit={handleSubmitModalAdd}
				mode={isDirect ? 'create' : 'edit'}
				listMemberInConversation={conversation.members}
			/>
		</>
	);
}
