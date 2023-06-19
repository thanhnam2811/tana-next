import { uploadFileApi } from '@common/api';
import { useFetcher } from '@common/hooks';
import { IFile } from '@common/types';
import { randomUtil, stringUtil } from '@common/utils';
import { useAuth } from '@modules/auth/hooks';
import { sendMessageApi } from '@modules/messages/api';
import { ConversationAvatar, MessageItem } from '@modules/messages/components';
import { useConversationContext } from '@modules/messages/hooks';
import { IMember, MessageFormType, MessageType } from '@modules/messages/types';
import { conversationConfig } from '@modules/messages/utils';
import { UserAvatar } from '@modules/user/components';
import {
	App,
	Avatar,
	Badge,
	Button,
	Form,
	Image,
	Input,
	List,
	Popover,
	Space,
	Spin,
	Tag,
	Tooltip,
	Typography,
	theme,
} from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import classnames from 'classnames';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { HiX } from 'react-icons/hi';
import { HiArrowSmallDown, HiFaceSmile, HiPaperAirplane, HiPaperClip, HiPlus } from 'react-icons/hi2';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ConversationMessage.module.scss';

export function ConversationMessage() {
	const { modal } = App.useApp();
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();
	const [form] = Form.useForm<MessageFormType>();
	const { conversation, info, updateConversation } = useConversationContext();

	const id = router.query.id as string;

	const msgFetcher = useFetcher<MessageType>({ api: `conversations/${id}/messages` });

	const { data: listMessage } = msgFetcher;

	const textInputRef = useRef<TextAreaRef>(null);
	const sendMessage = async (data: MessageFormType) => {
		form.resetFields();
		setTimeout(() => textInputRef.current?.focus(), 0);

		const msgPlaceholder: MessageType = {
			...data,
			_id: randomUtil.string(24),
			sender: authUser!,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			media: [],
			sending: true,
		};

		if (data._id) {
			delete msgPlaceholder.error;
			msgFetcher.updateData(data._id, msgPlaceholder);
		} else {
			if (data.files)
				msgPlaceholder.media = data.files?.map<IFile>((file) => ({
					_id: randomUtil.string(24),
					name: file.name,
					originalname: file.name,
					link: URL.createObjectURL(file),
					size: file.size,
					type: file.type,
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}));

			msgFetcher.addData(msgPlaceholder);
		}

		try {
			// Upload file
			if (data.files?.length) {
				const uploaded = await uploadFileApi(data.files);
				data.media = uploaded.files.map(({ _id }) => _id);
			}
			delete data.files;

			// Send message
			const msg = await sendMessageApi(id, data);

			// Update data in fetcher
			msgFetcher.updateData(msgPlaceholder._id, msg);

			// Update last message in conversation
			updateConversation({
				...conversation,
				lastest_message: msg,
			});
		} catch (error: any) {
			msgFetcher.updateData(msgPlaceholder._id, {
				...msgPlaceholder,
				sending: false,
				error: error.message || error.toString(),
			});
		}
	};

	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

	useEffect(() => {
		// Scroll
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

	const files = Form.useWatch('files', form);
	const inputFilesRef = useRef<HTMLInputElement>(null);

	const onDropAccepted = (acceptedFiles: File[]) => {
		const files = (form.getFieldValue('files') as File[]) || [];
		files.push(...acceptedFiles);

		form.setFieldValue('files', files);
	};

	const onDropRejected = (rejectedFiles: FileRejection[]) =>
		modal.error({
			title: 'File không hợp lệ',
			content: (
				<List
					bordered
					size="small"
					dataSource={rejectedFiles}
					renderItem={(item) => {
						const error = item.errors.pop();
						return (
							<List.Item>
								<List.Item.Meta
									title={item.file.name}
									description={
										<Typography.Text type="danger" strong>
											{error?.message || 'Lỗi không xác định'}
										</Typography.Text>
									}
								/>
							</List.Item>
						);
					}}
				/>
			),
		});

	const dropzone = useDropzone({ onDropAccepted, onDropRejected, ...conversationConfig.dropzone });

	const { getRootProps, getInputProps, isDragAccept, isDragReject } = dropzone;

	const typingRef = useRef<any>(null);

	const emitStopTyping = () => {
		// emit stop typing event
		window.socket.emit('stopTypingMessage', {
			conversation: id,
			senderId: authUser?._id,
		});

		// clear typingRef
		typingRef.current = null;
	};

	const emitTyping = () => {
		// if typingRef is null, emit typing event
		if (!typingRef.current)
			window.socket.emit('typingMessage', {
				conversation: id,
				senderId: authUser?._id,
			});
		// if typingRef is not null, clear timeout
		else clearTimeout(typingRef.current);

		// set timeout to emit stop typing event after 1s
		typingRef.current = setTimeout(emitStopTyping, 1000);
	};

	// listen typing event from socket io
	const [typingList, setTypingList] = useState<IMember[]>([]);

	useEffect(() => {
		if (id) {
			window.socket.on('typingMessage', ({ senderId }: { senderId: string }) => {
				const typer = conversation.members.find(({ user }: IMember) => user._id === senderId);
				if (typer) setTypingList((prev) => [...prev, typer]);
			});

			window.socket.on('stopTypingMessage', ({ senderId }: any) => {
				setTypingList((prev) => prev.filter(({ user }) => user._id !== senderId));
			});

			window.socket.on('sendMessage', (msg: MessageType) => {
				if (msg.conversation === id) {
					if (authUser?._id !== msg.sender._id) {
						msgFetcher.addData(msg);
					}
				}
			});
		}

		return () => {
			window.socket.off('typingMessage');
			window.socket.off('stopTypingMessage');
			window.socket.off('sendMessage');
		};
	}, [id]);

	return (
		<Form className={styles.container} form={form} onFinish={sendMessage} initialValues={{ files: [], text: '' }}>
			<div className={styles.history} {...getRootProps()}>
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
							<Space direction="vertical" style={{ width: 'fit-content', margin: 'auto' }} align="center">
								<ConversationAvatar conversation={conversation} />

								<Typography.Title level={4} style={{ margin: 0 }}>
									{info?.name}
								</Typography.Title>

								<Typography.Text type="secondary">{info?.description}</Typography.Text>
							</Space>
						}
					>
						{/* Bottom ref */}
						<div ref={bottomRef} />

						<Image.PreviewGroup>
							{listMessage.map((item, index) => {
								const isSystem = item.isSystem;
								if (isSystem)
									return (
										<Tag color="cyan" className={styles.system_message}>
											{stringUtil.renderHTML(item.text)}
										</Tag>
									);

								const prev = listMessage[index - 1];
								const prevCombine = prev && prev.sender?._id === item.sender?._id;

								const next = listMessage[index + 1];
								const nextCombine = next && next.sender?._id === item.sender?._id;

								return (
									<MessageItem
										key={item._id}
										message={item}
										prevCombine={prevCombine}
										nextCombine={nextCombine}
										onRetry={() =>
											sendMessage({
												...item,
												media: item.media?.map((file) => file._id),
											})
										}
									/>
								);
							})}
						</Image.PreviewGroup>
					</InfiniteScroll>
				</div>

				<Button
					shape="circle"
					icon={<HiArrowSmallDown />}
					onClick={scrollToBottom}
					className={styles.scroll_down}
					id="scroll-down-btn"
				/>

				<Space
					className={classnames(styles.typing, { [styles.show]: typingList.length > 0 })}
					style={{
						backgroundColor: token.colorBgContainer,
						borderColor: token.colorBorder,
					}}
				>
					<Avatar.Group maxCount={3} size="small" className={styles.typing_list}>
						{typingList.map(({ user, nickname }: IMember) => (
							<UserAvatar key={user._id} user={user} nickname={nickname} avtSize={24} />
						))}
					</Avatar.Group>

					<Typography.Text type="secondary" className={styles.typing_text}>
						đang soạn tin...
					</Typography.Text>
				</Space>

				<div
					className={styles.dropzone}
					style={{
						zIndex: isDragAccept || isDragReject ? 1 : -1,
						opacity: isDragAccept || isDragReject ? 1 : 0,
					}}
				>
					<Form.Item name="files" hidden />
					<input {...getInputProps()} ref={inputFilesRef} />
					<div className={styles.dropzone_content} style={{ borderColor: token.colorPrimary }}>
						<Typography.Text strong>Gửi file</Typography.Text>

						<Typography.Text type="secondary">Thả file vào đây để gửi</Typography.Text>
					</div>
					TS
				</div>
			</div>

			<div className={styles.input_container}>
				<Space className={styles.input} style={{ borderColor: token.colorBorder }}>
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
							onKeyDown={emitTyping}
						/>
					</Form.Item>

					<Tooltip title="Thêm icon">
						<Button shape="circle" icon={<HiFaceSmile />} />
					</Tooltip>

					<Popover
						title={
							<Space align="center" style={{ width: '100%' }}>
								<Typography.Text strong>Đính kèm</Typography.Text>

								<Tooltip title="Thêm file">
									<Button
										shape="circle"
										size="small"
										onClick={() => inputFilesRef.current?.click()}
										icon={<HiPlus />}
										style={{ marginLeft: 'auto' }}
									/>
								</Tooltip>
							</Space>
						}
						content={
							<List
								className={styles.file_list}
								size="small"
								bordered
								dataSource={files}
								renderItem={(file: File) => (
									<List.Item
										extra={
											<Button
												shape="circle"
												icon={<HiX />}
												size="small"
												onClick={() => {
													const files = form.getFieldValue('files') as File[];
													form.setFieldValue(
														'files',
														files.filter((f) => f !== file)
													);
												}}
											/>
										}
									>
										<List.Item.Meta title={file.name} />
									</List.Item>
								)}
							/>
						}
						trigger={['click']}
					>
						<Tooltip title="Đính kèm">
							<Badge count={files?.length}>
								<Button shape="circle" icon={<HiPaperClip />} />
							</Badge>
						</Tooltip>
					</Popover>

					<Tooltip title="Gửi">
						<Button shape="circle" icon={<HiPaperAirplane />} htmlType="submit" />
					</Tooltip>
				</Space>
			</div>
		</Form>
	);
}
