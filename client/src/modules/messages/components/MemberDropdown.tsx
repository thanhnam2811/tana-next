import React from 'react';
import { ConversationType, IMember } from '../types';
import { useAuth } from '@modules/auth/hooks';
import { Dropdown, DropdownProps, MenuProps } from 'antd';
import { merge } from 'lodash';

interface Props {
	conversation: ConversationType;
	member: IMember;
}

export function MemberDropdown({ conversation, member, ...props }: Props & DropdownProps) {
	const { authUser } = useAuth();
	const authMember = conversation.members.find((m) => m.user._id === authUser!._id);

	const isAuthMember = authMember?.user._id === member.user._id;

	const items: MenuProps['items'] = [
		{
			key: 'profile',
			label: 'Xem trang cá nhân',
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
	if (authMember?.role === 'admin' && member.role !== 'admin') {
		items.push(
			{
				key: 'admin',
				label: 'Chọn làm quản trị viên',
			},
			{
				key: 'remove',
				label: 'Xóa khỏi nhóm',
			}
		);
	}

	return <Dropdown arrow trigger={['click']} {...merge({ menu: { items } }, props)} />;
}
