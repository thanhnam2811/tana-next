import React from 'react';
import { ConversationType, IMember } from '../types';
import { useAuth } from '@modules/auth/hooks';
import { App, Dropdown, DropdownProps, Form, Input, MenuProps } from 'antd';
import { merge } from 'lodash';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { changeNicknameApi, changeRoleApi } from '@modules/messages/api';

interface Props {
	conversation: ConversationType;
	member: IMember;
}

export function MemberDropdown({ conversation, member, ...props }: Props & DropdownProps) {
	const { modal } = App.useApp();
	const { authUser } = useAuth();

	const authMember = conversation.members.find((m) => m.user._id === authUser!._id);
	const isAuthMember = authMember?.user._id === member.user._id;

	const [changeNicknameForm] = Form.useForm();
	const handleChangeNickname = async (values: { nickname: string }) => {
		const toastId = toast.loading('Đang đổi biệt danh...');
		try {
			await changeNicknameApi({
				conversationId: conversation._id,
				userId: member.user._id,
				nickname: values.nickname,
			});
			toast.success('Đổi biệt danh thành công!', { id: toastId });
		} catch (error) {
			toast.error('Đổi biệt danh thất bại!', { id: toastId });
		}
	};

	const handleChangeRole = async (role: 'admin' | 'member') => {
		const toastId = toast.loading('Đang thay đổi quyền...');
		try {
			await changeRoleApi({
				conversationId: conversation._id,
				userId: member.user._id,
				role,
			});
			toast.success('Thay đổi quyền thành công!', { id: toastId });
		} catch (error) {
			toast.error('Thay đổi quyền thất bại!', { id: toastId });
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
			}
		);
	}

	return <Dropdown arrow trigger={['click']} {...merge({ menu: { items } }, props)} />;
}
