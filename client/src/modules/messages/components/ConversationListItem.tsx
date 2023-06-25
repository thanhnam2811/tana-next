import { useAuth } from '@modules/auth/hooks';
import { dateUtil, stringUtil } from '@common/utils';
import { Button, theme, Typography } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from './ConversationListItem.module.scss';
import { ConversationType } from '../types';
import { ConversationAvatar } from './ConversationAvatar';
import { getConversationInfo } from '@modules/messages/utils';

interface Props {
	conversation: ConversationType;
}

export function ConversationListItem({ conversation }: Props) {
	const { authUser } = useAuth();
	const { token } = theme.useToken();

	const router = useRouter();
	const id = router.query.id as string;

	const active = id === conversation._id;

	const { lastest_message } = conversation;

	const { name } = getConversationInfo(conversation, authUser!);

	const unread = lastest_message ? !lastest_message?.reader?.find(({ _id }) => _id === authUser!._id) : false;

	return (
		<Link href={`/messages?id=${conversation._id}`} draggable className={styles.container}>
			<Button className={active ? styles.active : ''} type={active ? 'primary' : 'text'} block>
				<div className={styles.avatar}>
					<ConversationAvatar conversation={conversation} size={40} />
				</div>

				<div className={styles.content}>
					<Typography.Title level={5} ellipsis className={styles.name}>
						{name}
					</Typography.Title>

					<div className={styles.lastest_message}>
						<Typography.Text
							type="secondary"
							style={{ color: unread ? token.colorText : undefined }}
							strong={unread}
							className={styles.text}
						>
							{stringUtil.renderHTML(lastest_message?.text) || <i>Không có tin nhắn</i>}
						</Typography.Text>

						<Typography.Text className={styles.time_ago}>
							{dateUtil.getTimeAgo(lastest_message?.createdAt)}
						</Typography.Text>
					</div>
				</div>
			</Button>
		</Link>
	);
}
