import { ConversationFormType, ConversationType } from '@modules/messages/types';
import { App, Button, Input, InputRef, Space } from 'antd';
import React from 'react';
import { HiMagnifyingGlass, HiPencil } from 'react-icons/hi2';
import { useRef } from 'react';

interface Props {
	onUpdate: (conversation: ConversationFormType) => Promise<void>;
	conversation: ConversationType;
}

export function InfoMenu({ onUpdate, conversation }: Props) {
	const { modal } = App.useApp();

	const inputNameRef = useRef<InputRef>(null);
	const handleChangeName = async () =>
		modal.info({
			title: 'Đổi tên cuộc trò chuyện',
			content: <Input placeholder="Tên cuộc trò chuyện" defaultValue={conversation.name} ref={inputNameRef} />,
			okText: 'Lưu',
			cancelText: 'Hủy',
			onOk: () => onUpdate({ name: inputNameRef.current!.input?.value }),
		});

	return (
		<Space direction="vertical" style={{ width: '100%' }}>
			<Button block icon={<HiPencil />} onClick={handleChangeName}>
				Đổi tên
			</Button>

			<Button block icon={<HiMagnifyingGlass />}>
				Tìm kiếm
			</Button>
		</Space>
	);
}
