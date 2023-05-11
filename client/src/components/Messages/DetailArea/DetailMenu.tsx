import { Box } from '@mui/material';
import { MessageContext } from '@pages/messages/[id]';
import { conversationApi, fileApi } from '@utils/api';
import { showIncomingAlert } from '@utils/common';
import { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Menu } from './components';

export function DetailMenu() {
	const avatarRef = useRef<HTMLInputElement>(null);
	const { conversation, isDirect, updateConversation } = useContext(MessageContext)!;

	const [editMember, setEditMember] = useState<any>(null);
	const memberInConversation =
		editMember && conversation.members.find((member: any) => member.user?._id === editMember.user?._id);

	// set edit member again to update UI
	useEffect(() => {
		if (editMember) setEditMember(memberInConversation);
	}, [memberInConversation?.role, memberInConversation?.nickname]); // when role or nickname change

	const handleEditAvatar = async (e: any) => {
		if (!e.target.files || e.target.files.length === 0) return;

		const conv = conversation; // For rollback UI
		try {
			// Optimistic UI
			const newAvatar = { ...conversation.avatar, link: URL.createObjectURL(e.target.files[0]) };
			let newConv = { ...conversation, avatar: newAvatar };
			updateConversation(newConv);

			// upload file
			const fileRes = await fileApi.upload(e.target.files);
			const file = fileRes.data.files[0];

			// update conversation
			const res = await conversationApi.update(conversation._id, { avatar: file._id });
			newConv = res.data;

			// Show toast
			toast.success('Thay đổi ảnh đại diện thành công!');
		} catch (error) {
			// Rollback UI
			updateConversation(conv);

			// Show toast
			toast.error('Thay đổi ảnh đại diện thất bại!');
		} finally {
			// Reset input file
			if (avatarRef.current) avatarRef.current.value = '';
		}
	};

	const listDropdown = [
		{
			label: 'Hình ảnh & Video',
			// ChildComponent: <ListImage conversation={conversation} handlePreviewMedia={handlePreviewMedia} />,
		},
		{
			label: 'File',
			// ChildComponent: <ListFile conversation={conversation} />,
		},
		{
			label: 'Liên kết',
		},
		{
			label: 'Cài đặt & Bảo mật',
			options: [1, 2, 3].map((item) => ({
				label: `Cài đặt ${item}`,
				onClick: showIncomingAlert,
			})),
		},
	];

	return (
		<Box flexGrow={1} overflow="auto" my="8px">
			{!isDirect && <input type="file" hidden onChange={handleEditAvatar} ref={avatarRef} accept="image/*" />}

			{listDropdown.map((item, index) => (
				<Menu key={index} {...item} />
			))}
		</Box>
	);
}
