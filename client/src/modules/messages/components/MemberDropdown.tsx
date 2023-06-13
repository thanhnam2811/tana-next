import React from 'react';
import { ConversationType, IMember } from '../types';
import { useAuth } from '@modules/auth/hooks';
import { App, Dropdown, DropdownProps, Form, Input, MenuProps } from 'antd';
import { merge } from 'lodash';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { changeNicknameApi, changeRoleApi, removeMemberApi } from '@modules/messages/api';

interface Props {
	conversation: ConversationType;
	member: IMember;
	onUpdateMember?: (conversation: ConversationType) => void;
}

export function MemberDropdown({ conversation, member, onUpdateMember, ...props }: Props & DropdownProps) {
	const { modal } = App.useApp();
	const { authUser } = useAuth();

	const authMember = conversation.members.find((m) => m.user._id === authUser!._id);
	const isAuthMember = authMember?.user._id === member.user._id;

	const [changeNicknameForm] = Form.useForm();
	const handleChangeNickname = async (values: { nickname: string }) => {
		const toastId = toast.loading('Đang đổi biệt danh...');
		try {
			const updated = await changeNicknameApi({
				conversationId: conversation._id,
				userID: member.user._id,
				nickname: values.nickname,
			});
			onUpdateMember?.(updated);

			toast.success('Đổi biệt danh thành công!', { id: toastId });
		} catch (error) {
			toast.error('Đổi biệt danh thất bại!', { id: toastId });
		}
	};

	const items: MenuProps['items'] = [
		{
			key: 'profile',
			label: <Link href={`/profile?id=${member.user._id}`}>Xem trang cá nhân</Link>,
		},
		{
			key: 'change-nickname',
			label: 'Đổi biệt danh',
			onClick: () =>
				modal.info({
					title: 'Đổi biệt danh',
					content: (
						<Form
							form={changeNicknameForm}
							initialValues={{ nickname: member.nickname }}
							onFinish={handleChangeNickname}
						>
							<Form.Item name="nickname" label="Biệt danh">
								<Input />
							</Form.Item>
						</Form>
					),
					onOk: () => changeNicknameForm.submit(),
					closable: true,
					maskClosable: true,
				}),
		},
	];

	// If is auth member, can leave group
	if (isAuthMember) {
		items.push({
			key: 'leave',
			label: 'Rời khỏi nhóm',
		});
	}

	// Else, can send message
	else {
		items.push({
			key: 'message',
			label: 'Nhắn tin',
		});
	}

	const handleChangeRole = async (role: 'admin' | 'member') => {
		const toastId = toast.loading('Đang thay đổi quyền...');
		try {
			const updated = await changeRoleApi({
				conversationId: conversation._id,
				userID: member.user._id,
				role,
			});
			onUpdateMember?.(updated);

			toast.success('Thay đổi quyền thành công!', { id: toastId });
		} catch (error) {
			toast.error('Thay đổi quyền thất bại!', { id: toastId });
		}
	};

	const handleRemoveMember = async () => {
		const toastId = toast.loading('Đang xóa thành viên...');
		try {
			const updated = await removeMemberApi({
				conversationId: conversation._id,
				userID: member.user._id,
			});
			onUpdateMember?.(updated);

			toast.success('Xóa thành viên thành công!', { id: toastId });
		} catch (error) {
			toast.error('Xóa thành viên thất bại!', { id: toastId });
		}
	};

	// Only admin can change role, remove member
	if (authMember?.role === 'admin') {
		items.push(
			{
				key: 'change-role',
				label: 'Thay đổi quyền',
				children: [
					{
						key: 'admin',
						label: 'Quản trị viên',
						disabled: member.role === 'admin',
						onClick: () => handleChangeRole('admin'),
					},
					{
						key: 'member',
						label: 'Thành viên',
						disabled: member.role === 'member',
						onClick: () => handleChangeRole('member'),
					},
				],
			},
			{
				key: 'remove',
				label: 'Xóa khỏi nhóm',
				onClick: handleRemoveMember,
			}
		);
	}

	return <Dropdown arrow trigger={['click']} {...merge({ menu: { items } }, props)} />;
}
