import { WhiteBox } from '@components/Box';
import { useInfiniteFetcher } from '@hooks';
import { Box, Divider, Grid, Typography, styled } from '@mui/material';
import { fileApi } from '@utils/api';
import { messageApi } from '@utils/api/message-api';
import { randomString } from '@utils/common';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import styles from './MessageArea.module.css';
import { MessageFooter } from './MessageFooter';
import { MessageHeader } from './MessageHeader';
import { MessagesHistory } from './MessageHistory';
import { messageConfig } from './config';
import { MessageContext } from '@pages/messages/[id]';
import { useUserStore } from '@store';

interface Props {
	// eslint-disable-next-line no-unused-vars
	onMediaPreview: (media: string) => void;
}

export function MessageArea({ onMediaPreview }: Props) {
	const { conversation } = useContext(MessageContext)!;
	const router = useRouter();
	const id = router.query.id as string;
	const messageFetcher = useInfiniteFetcher(`/conversations/${id}/messages`);

	const idRef = useRef(id);
	// reload data when conversation change
	useEffect(() => {
		idRef.current = id;
		messageFetcher.reload();

		if (conversation) {
			window.socket.on('receiveMessage', (msg: any) => {
				if (msg.conversation === id) messageFetcher.addData(msg);
			});
		}

		return () => {
			window.socket.off('receiveMessage');
		};
	}, [id]);

	const { user } = useUserStore();

	const handleSendMessage = async (text: string) => {
		const isValidToSend = text?.trim() !== '' || filesSelected.length > 0;
		if (!isValidToSend) return; // do nothing

		// Optimistic UI
		const sending_id = randomString(10);
		const newMessagePlaceholder = {
			_id: sending_id,
			text,
			sender: user,
			sending: true,
			media: filesSelected,
		};
		messageFetcher.addData(newMessagePlaceholder);

		// upload file
		const fileIds: any[] = [];
		if (filesSelected.length) {
			// clear selected files
			setFilesSelected([]);
			try {
				// upload file
				const res = await fileApi.upload(filesSelected, { conversation: id });

				// add file id to message
				res.data?.files?.forEach((file: any) => fileIds.push(file._id));
			} catch (error) {
				// update message if upload file failed
				return messageFetcher.updateData(sending_id, {
					sending: false,
					error: 'Tải file lên thất bại!',
				});
			}
		}

		// send message
		try {
			// create message
			const res = await messageApi.create(id, { text, media: fileIds });
			const sendedMessage = { ...res.data, sending: false };

			// emit event to socket
			window.socket.emit('sendMessage', sendedMessage);

			// update message if conversation is not changed
			if (idRef.current === id) messageFetcher.updateData(sending_id, sendedMessage);
		} catch (error) {
			// update message if send message failed
			messageFetcher.updateData(sending_id, {
				sending: false,
				error: 'Gửi tin nhắn thất bại!',
			});
		}
	};

	const [filesSelected, setFilesSelected] = useState<File[]>([]);
	const onDropAccepted = (acceptedFiles: File[]) => setFilesSelected((prev) => [...prev, ...acceptedFiles]);

	const onDropRejected = (rejectedFiles: FileRejection[]) => {
		Swal.fire({
			icon: 'error',
			title: 'Không hợp lệ!',
			html: `<table class="${styles['table-files-error']}"> 
				<thead>
					<tr>
						<th>Tên file</th>
						<th>Lỗi</th>
					</tr>
				</thead>
				<tbody>
					${rejectedFiles
						.map(
							(file) =>
								`<tr>
									<td>${file.file.name}</td>
									<td>${file.errors[1]?.message}</td>
								</tr>`
						)
						.join('')}
				</tbody>
			</table>`,
		});
	};

	const dropzone = useDropzone({ onDropAccepted, onDropRejected, ...messageConfig.dropzone });

	const { getRootProps, getInputProps, isDragAccept, isDragReject } = dropzone;

	return (
		<WhiteBox sx={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
			{/* Message Header */}
			<MessageHeader />
			<Divider />

			{/* Message History */}
			<Grid item xs overflow="hidden" position="relative" {...getRootProps({})}>
				<MessagesHistory onMediaPreview={onMediaPreview} fetcher={messageFetcher} />

				{/* Message Dropzone */}
				<DropzoneOuter
					sx={{
						zIndex: isDragAccept || isDragReject ? 1 : -1,
						opacity: isDragAccept || isDragReject ? 1 : 0,
					}}
				>
					<input {...getInputProps()} />
					<DropzoneInner>
						<Typography fontSize={18} fontWeight={700} color="primary.main">
							Gửi file
						</Typography>
						<Typography fontSize={16} fontWeight={500}>
							Thả file vào đây để gửi
						</Typography>
					</DropzoneInner>
				</DropzoneOuter>
			</Grid>

			{/* Message Input */}
			<Grid item xs="auto">
				<MessageFooter
					{...dropzone}
					filesSelected={filesSelected}
					onRemoveFile={(file) => setFilesSelected(filesSelected.filter((f) => f !== file))}
					onSend={handleSendMessage}
				/>
			</Grid>
		</WhiteBox>
	);
}

const DropzoneOuter = styled(Box)({
	position: 'absolute',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	padding: 1,
	backgroundColor: 'rgba(0,0,0,0.4)',
	backdropFilter: 'blur(8px)',
	pointerEvents: 'none',
	color: 'white',
});

const DropzoneInner = styled(Box)({
	width: '100%',
	height: '100%',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	borderStyle: 'dashed',
	borderWidth: 2,
	borderColor: 'primary.main',
	borderRadius: 1,
});
