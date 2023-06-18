import { fileUtil } from '@common/utils';
import { useAuth } from '@modules/auth/hooks';
import { MessageType } from '@modules/messages/types';
import { UserAvatar } from '@modules/user/components';
import { Button, Image, List, Space, Spin, theme, Tooltip, Typography } from 'antd';
import classnames from 'classnames';
import { HiDownload } from 'react-icons/hi';
import { HiArrowPath, HiEye } from 'react-icons/hi2';
import styles from './MessageItem.module.scss';
import Link from 'next/link';

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
							<List.Item
								className={styles.file_item}
								extra={
									<Link href={item.link} target="_blank" download>
										<Button shape="circle" key="download" icon={<HiDownload />} size="small" />
									</Link>
								}
							>
								<Image
									className={styles.file_icon}
									preview={
										!!fileUtil.isImage(item.name) && {
											maskClassName: styles.file_icon,
											mask: <HiEye />,
										}
									}
									src={fileUtil.getFilePreview(item)}
									alt={item.originalname}
								/>

								<Typography.Text strong className={styles.file_name}>
									{item.originalname}
								</Typography.Text>
							</List.Item>
						)}
					/>
				)}

				<Typography.Text className={styles.text}>{message.text}</Typography.Text>
			</Space>

			{message.sending && <Spin size="small" style={{ alignSelf: 'center' }} />}

			{message.error && (
				<Tooltip title="Thử lại">
					<Button size="small" type="text" shape="circle" icon={<HiArrowPath />} onClick={onRetry} danger />
				</Tooltip>
			)}

			{message.error && <Typography.Text type="danger">{message.error}</Typography.Text>}
		</Space>
	);
}
