import { useAuth } from '@modules/auth/hooks';
import { getTimeAgo } from '@utils/common';
import { Button, Typography, theme } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/ConversationListItem.module.scss';
import { ConversationType } from '../types';
import { ConversationAvatar } from './ConversationAvatar';

interface Props {
	conversation: ConversationType;
}

export function ConversationListItem({ conversation }: Props) {
	const { authUser } = useAuth();
	const { token } = theme.useToken();

	const router = useRouter();
	const id = router.query.id as string;

	const active = id === conversation._id;

	const { members, lastest_message, name } = conversation;

	const isDirect = members?.length === 2;
	const receiver = (isDirect && members?.find((member) => member.user._id !== id)!.user) || null;

	const unread = lastest_message ? !lastest_message?.reader?.find(({ _id }) => _id === authUser!._id) : false;

	return (
		<Link href={`/messages?id=${conversation._id}`} draggable className={styles.container}>
			<Button className={active ? styles.active : ''} type={active ? 'primary' : 'text'} block>
				<div className={styles.avatar}>
					<ConversationAvatar conversation={conversation} size={40} />
				</div>

				<div className={styles.content}>
					<Typography.Title level={5} ellipsis className={styles.name}>
						{isDirect ? receiver?.fullname : name}
					</Typography.Title>

					<div className={styles.lastest_message}>
						<Typography.Text
							type="secondary"
							ellipsis
							style={{ color: unread ? token.colorText : undefined }}
							strong={unread}
							className={styles.text}
						>
							{lastest_message?.text || <i>Không có tin nhắn</i>}
						</Typography.Text>

						<Typography.Text className={styles.time_ago}>
							{getTimeAgo(lastest_message?.createdAt)}
						</Typography.Text>
					</div>
				</div>
			</Button>
		</Link>
	);
}
