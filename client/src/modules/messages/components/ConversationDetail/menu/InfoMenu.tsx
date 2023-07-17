import { useConversationContext } from '@modules/messages/hooks';
import { App, Button, Input, InputRef, Space } from 'antd';
import { useRef } from 'react';
import { HiMagnifyingGlass, HiPencil } from 'react-icons/hi2';
import { getConversationInfo } from '@modules/messages/utils';
import { useAuth } from '@modules/auth/hooks';

export function InfoMenu() {
	const { authUser } = useAuth();
	const { conversation, updateConversationForm } = useConversationContext();
	const { modal } = App.useApp();

	const { name } = getConversationInfo(conversation, authUser!);
	const inputNameRef = useRef<InputRef>(null);
	const handleChangeName = async () =>
		modal.info({
			title: 'Đổi tên cuộc trò chuyện',
			content: <Input placeholder="Tên cuộc trò chuyện" defaultValue={name} ref={inputNameRef} />,
			okText: 'Lưu',
			cancelText: 'Hủy',
			onOk: () => updateConversationForm({ name: inputNameRef.current!.input?.value }),
			okCancel: true,
			closable: true,
			maskClosable: true,
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
