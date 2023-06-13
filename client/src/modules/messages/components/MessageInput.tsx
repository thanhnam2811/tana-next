import React, { useRef } from 'react';
import styles from './MessageInput.module.scss';
import { Button, Form, Input, Space, theme, Tooltip } from 'antd';
import { HiFaceSmile, HiPaperAirplane, HiPaperClip } from 'react-icons/hi2';
import { MessageFormType } from '../types';
import { TextAreaRef } from 'antd/es/input/TextArea';

interface Props {
	onSend?: (data: MessageFormType) => void;
}

export default function MessageInput({ onSend }: Props) {
	const { token } = theme.useToken();
	const [form] = Form.useForm<MessageFormType>();

	const textInputRef = useRef<TextAreaRef>(null);

	const onFinish = (values: MessageFormType) => {
		onSend?.(values);
		form.resetFields();

		setTimeout(() => textInputRef.current?.focus(), 0);
	};

	return (
		<Form form={form} onFinish={onFinish} className={styles.input_container}>
			<Space className={styles.input} style={{ borderColor: token.colorBorder }}>
				<Tooltip title="Đính kèm">
					<Button shape="circle" icon={<HiPaperClip />} />
				</Tooltip>

				<Tooltip title="Thêm icon">
					<Button shape="circle" icon={<HiFaceSmile />} />
				</Tooltip>

				<Form.Item
					name="text"
					rules={[
						{
							required: true,
							message: 'Vui lòng nhập tin nhắn',
						},
					]}
					noStyle
				>
					<Input.TextArea
						placeholder="Nhập tin nhắn"
						autoSize={{ maxRows: 5 }}
						bordered={false}
						onPressEnter={(e) => {
							if (e.shiftKey) return;

							const text = e.currentTarget.value?.trim();
							if (!text) return;

							e.preventDefault();
							form.submit();
						}}
						ref={textInputRef}
					/>
				</Form.Item>

				<Tooltip title="Gửi">
					<Button shape="circle" icon={<HiPaperAirplane />} htmlType="submit" />
				</Tooltip>
			</Space>
		</Form>
	);
}
