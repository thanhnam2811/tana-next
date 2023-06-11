import { useFetcher } from '@common/hooks';
import { useAuth } from '@modules/auth/hooks';
import { sendMessageApi } from '@modules/messages/api';
import { MessageFormType, MessageType } from '@modules/messages/types';
import { UserAvatar } from '@modules/user/components';
import { randomString, stringUtil } from '@utils/common';
import { Button, Space, Spin, Tag, theme } from 'antd';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { HiArrowSmallDown } from 'react-icons/hi2';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from '../../styles/ConversationMessage.module.scss';
import MessageInput from '../MessageInput';

export function ConversationMessage() {
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();

	const id = router.query.id as string;

	const msgFetcher = useFetcher<MessageType>({ api: `conversations/${id}/messages` });

	const { data: listMessage } = msgFetcher;

	const sendMessage = async (data: MessageFormType) => {
		const msgPlaceholder: MessageType = {
			...data,
			_id: randomString(24),
			sender: authUser!,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			media: [],
			sending: true,
		};
		msgFetcher.addData(msgPlaceholder);

		try {
			const msg = await sendMessageApi(id, data);
			msgFetcher.updateData(msgPlaceholder._id, msg);
		} catch (error) {
			msgFetcher.removeData(msgPlaceholder._id);
		}
	};

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

	useEffect(() => {
		const msgHistoryEl = document.getElementById('messages-history');
		const scrollDownBtnEl = document.getElementById('scroll-down-btn');

		const handleScroll = (e: Event) => {
			const { scrollTop } = e.target as HTMLElement;

			if (scrollDownBtnEl) {
				const classList = scrollDownBtnEl.classList;
				if (scrollTop < -200) {
					if (!classList.contains(styles.show)) classList.add(styles.show);
				} else {
					if (classList.contains(styles.show)) classList.remove(styles.show);
				}
			}
		};

		msgHistoryEl?.addEventListener('scroll', handleScroll);

		return () => {
			msgHistoryEl?.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.history}>
				<div className={styles.history_content} id="messages-history">
					<InfiniteScroll
						scrollableTarget="messages-history"
						dataLength={listMessage.length}
						style={{ display: 'flex', flexDirection: 'column-reverse' }}
						next={msgFetcher.loadMore}
						hasMore={msgFetcher.hasMore}
						inverse={true}
						loader={<Spin style={{ margin: '8px auto' }} />}
						endMessage={
							<p style={{ textAlign: 'center' }}>
								<b>Đã tải hết tin nhắn!</b>
							</p>
						}
					>
						{/* Bottom ref */}
						<div ref={bottomRef} />

						{listMessage.map((item, index) => {
							const isSystem = item.isSystem;
							if (isSystem)
								return (
									<Tag color="cyan" className={styles.system_message}>
										{stringUtil.renderHTML(item.text)}
									</Tag>
								);

							const classes = [styles.message];

							const isMine = item.sender?._id === authUser!._id;
							classes.push(isMine ? styles.me : styles.other);

							const prev = listMessage[index - 1];
							const isPrevGroup = prev && prev.sender?._id === item.sender?._id;

							const next = listMessage[index + 1];
							const isNextGroup = next && next.sender?._id === item.sender?._id;

							const contentClasses = [styles.message_content];
							if (item.sending) contentClasses.push(styles.sending);

							return (
								<Space
									key={item._id}
									style={{
										marginTop: isNextGroup ? 2 : 8,
										marginBottom: isPrevGroup ? 2 : 8,
									}}
									className={classnames(classes)}
									align="end"
								>
									{!isMine && (
										<UserAvatar
											user={item.sender}
											style={{ visibility: isPrevGroup ? 'hidden' : 'visible' }}
											avtSize={20}
										/>
									)}

									<div
										className={classnames(contentClasses)}
										style={{
											backgroundColor: isMine ? token.colorBorder : undefined,
											borderColor: token.colorBorder,
										}}
									>
										{item.text}
									</div>
								</Space>
							);
						})}
					</InfiniteScroll>
				</div>

				<Button
					shape="circle"
					icon={<HiArrowSmallDown />}
					onClick={scrollToBottom}
					className={styles.scroll_down}
					id="scroll-down-btn"
				/>
			</div>

			<div className={styles.input_container}>
				<MessageInput onSend={sendMessage} />
			</div>
		</div>
	);
}
