import { MessageContext } from '@pages/messages/[id]';
import { conversationApi, fileApi } from '@utils/api';
import { showIncomingAlert } from '@utils/common';
import { useContext, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { FaEdit, FaPaintBrush, FaRegImage } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Menu, MenuOptionProps } from '../components';

export function ConfigMenu() {
	const avatarRef = useRef<HTMLInputElement>(null);
	const { conversation, isDirect, updateConversation } = useContext(MessageContext)!;

	const handleEditName = async () => {
		const { value: newName, isConfirmed } = await Swal.fire({
			title: 'Đổi tên cuộc trò chuyện',
			input: 'text',
			inputLabel: 'Tên nhóm mới',
			inputValue: conversation.name,
			inputValidator: (value) => {
				if (value?.trim() === '') return 'Tên nhóm không được bỏ trống!';
				return null;
			},
		});

		if (isConfirmed) {
			const conv = conversation; // For rollback UI

			try {
				// Optimistic UI
				let newConv = { ...conversation, name: newName };
				updateConversation(newConv);

				// Update to server
				const res = await conversationApi.update(conversation._id, { name: newName });
				newConv = res.data;

				// Show toast
				toast.success('Đổi tên nhóm thành công!');
			} catch (error) {
				// Rollback UI
				updateConversation(conv);

				// Show toast
				toast.error('Đổi tên nhóm thất bại!');
			}
		}
	};

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

	let menuOptions: MenuOptionProps[] = [
		{
			Icon: FaPaintBrush,
			label: 'Đổi chủ đề',
			onClick: showIncomingAlert,
		},
	];

	// Add more options if it's not a direct conversation
	if (!isDirect) {
		menuOptions = [
			...menuOptions,
			{
				Icon: FaEdit,
				label: 'Đổi tên',
				onClick: handleEditName,
			},
			{
				Icon: FaRegImage,
				label: 'Đổi hình ảnh',
				onClick: () => avatarRef.current?.click(),
			},
		];
	}

	return (
		<>
			{!isDirect && <input type="file" hidden onChange={handleEditAvatar} ref={avatarRef} accept="image/*" />}

			<Menu label="Tùy chỉnh" options={menuOptions} />
		</>
	);
}
