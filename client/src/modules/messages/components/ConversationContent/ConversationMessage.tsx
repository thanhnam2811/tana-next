import { useFetcher } from '@common/hooks';
import { randomUtil, stringUtil } from '@common/utils';
import { useAuth } from '@modules/auth/hooks';
import { sendMessageApi } from '@modules/messages/api';
import { MessageFormType, MessageType } from '@modules/messages/types';
import { conversationConfig } from '@modules/messages/utils';
import { App, Button, Form, Input, List, Space, Spin, Tag, theme, Tooltip, Typography } from 'antd';
import { TextAreaRef } from 'antd/es/input/TextArea';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import { HiArrowSmallDown, HiFaceSmile, HiPaperAirplane, HiPaperClip } from 'react-icons/hi2';
import InfiniteScroll from 'react-infinite-scroll-component';
import styles from './ConversationMessage.module.scss';
import { MessageItem } from '@modules/messages/components';
import { IFile } from '@common/types';
import { uploadFileApi } from '@common/api';

export function ConversationMessage() {
	const { modal } = App.useApp();
	const { authUser } = useAuth();
	const router = useRouter();
	const { token } = theme.useToken();
	const [form] = Form.useForm<MessageFormType>();

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

		try {
			// Upload file
			if (data.files && data.files.length > 0) {
				const uploaded = await uploadFileApi(data.files);
				data.media = uploaded.files.map(({ _id }) => _id);
				delete data.files;
			}

			// Send message
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

	const onDropAccepted = (acceptedFiles: File[]) => {
		const files = (form.getFieldValue('files') as File[]) || [];
		files.push(...acceptedFiles);
		console.log({ files });

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
								/>
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

				<div
					className={styles.dropzone}
					style={{
						zIndex: isDragAccept || isDragReject ? 1 : -1,
						opacity: isDragAccept || isDragReject ? 1 : 0,
					}}
				>
					<Form.Item name="files" hidden />

					<input {...getInputProps()} />
					<div className={styles.dropzone_content} style={{ borderColor: token.colorPrimary }}>
						<Typography.Text strong>Gửi file</Typography.Text>

						<Typography.Text type="secondary">Thả file vào đây để gửi</Typography.Text>
					</div>
				</div>
			</div>

			<div className={styles.input_container}>
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
			</div>
		</Form>
	);
}
