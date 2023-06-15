import React from 'react';
import { MessageType } from '@modules/messages/types';
import classnames from 'classnames';
import { UserAvatar } from '@modules/user/components';
import { Avatar, Button, List, Space, Spin, theme, Typography } from 'antd';
import styles from './MessageItem.module.scss';
import { useAuth } from '@modules/auth/hooks';
import { fileUtil } from '@common/utils';
import { HiArrowSmallDown, HiDocument } from 'react-icons/hi2';

interface Props {
	message: MessageType;
	prevCombine?: boolean;
	nextCombine?: boolean;
	onRetry?: () => void | Promise<void>;
}

export function MessageItem({ message, prevCombine, nextCombine, onRetry }: Props) {
	const { token } = theme.useToken();
	const { authUser } = useAuth();
	const classes = [styles.message];

	const isMine = message.sender?._id === authUser!._id;
	classes.push(isMine ? styles.me : styles.other);

	return (
		<Space
			style={{
				marginTop: nextCombine ? 2 : 8,
				marginBottom: prevCombine ? 2 : 8,
			}}
			className={classnames(classes)}
			align="end"
		>
			{!isMine && (
				<UserAvatar
					user={message.sender}
					style={{ visibility: prevCombine ? 'hidden' : 'visible' }}
					avtSize={20}
				/>
			)}

			<Space
				direction="vertical"
				className={styles.container}
				style={{
					backgroundColor: isMine ? token.colorBorder : undefined,
					borderColor: message.error ? token.colorError : token.colorBorder,
				}}
			>
				{message.media?.length > 0 && (
					<List
						size="small"
						dataSource={message.media}
						renderItem={(item) => (
							<List.Item>
								<Space style={{ width: 'auto' }}>
									<Avatar
										shape="square"
										src={fileUtil.getFilePreview(item)}
										size="large"
										icon={<HiDocument />}
									/>

									<Typography.Text strong>{item.originalname}</Typography.Text>
								</Space>
							</List.Item>
						)}
					/>
				)}

				<Typography.Text>{message.text}</Typography.Text>
			</Space>

			{message.sending && <Spin size="small" style={{ alignSelf: 'center' }} />}

			{message.error && (
				<Button type="text" shape="circle" icon={<HiArrowSmallDown />} onClick={onRetry} danger />
			)}

			{message.error && (
				<Typography.Text type="danger" style={{ alignSelf: 'center' }}>
					{message.error}
				</Typography.Text>
			)}
		</Space>
	);
}
