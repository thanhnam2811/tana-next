import { Box, Collapse, Stack, Typography } from '@mui/material';
import { getFilePreview, isImage, isVideo } from '@utils/data';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { DropzoneState } from 'react-dropzone';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MessageInput } from './MessageInput';
import { TypingMessage } from './TypingMessage';
import { MessageContext } from '@pages/messages/[id]';
import Image from 'next/image';

interface Props {
	filesSelected: File[];
	// eslint-disable-next-line no-unused-vars
	onRemoveFile: (file: File) => void;
	// eslint-disable-next-line no-unused-vars
	onSend: (text: string) => void;
}

export function MessageFooter({ filesSelected, onRemoveFile, onSend, open }: Props & DropzoneState) {
	const renderFilesSelected = () =>
		filesSelected.map((file, index) => (
			<Box
				key={index}
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 100,
					height: 100,
					borderRadius: 0.5,
					border: '1px solid #ccc',
					overflow: 'hidden',
					minWidth: 100,
					p: 0.5,
				}}
			>
				<AiFillCloseCircle
					style={{
						position: 'absolute',
						top: 4,
						right: 4,
						cursor: 'pointer',
						color: 'red',
						zIndex: 1,
					}}
					onClick={() => onRemoveFile(file)}
				/>
				{isVideo(file) ? (
					<video
						src={getFilePreview(file)}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
						controls
					/>
				) : (
					<Image
						loading="lazy"
						src={getFilePreview(file)}
						alt={file.name}
						style={{ objectFit: 'cover' }}
						width={100}
						height={100}
					/>
				)}
				<Typography
					sx={{
						position: 'absolute',
						bottom: 0,
						left: 0,
						width: '100%',
						backgroundColor: 'rgba(0,0,0,0.5)',
						color: '#fff',
						padding: 0.5,
						textAlign: 'center',
						backdropFilter: 'blur(5px)',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
					}}
					fontSize={12}
				>
					{file.name}
				</Typography>
			</Box>
		));

	const renderCountFilesSelected = () => {
		if (filesSelected.length === 0) return null;

		const countImage = filesSelected.filter((file) => isImage(file)).length;
		const countVideo = filesSelected.filter((file) => isVideo(file)).length;
		const countFile = filesSelected.length - countImage - countVideo;
		const countArray = [
			{ count: countImage, name: 'ảnh' },
			{ count: countVideo, name: 'video' },
			{ count: countFile, name: 'file' },
		].filter((item) => item.count > 0);

		return (
			<Typography
				sx={{
					'& b': {
						color: 'primary.main',
					},
					px: 1,
				}}
				variant="body2"
			>
				Đã chọn <b>{countArray.map(({ count, name }) => `${count} ${name}`).join(', ')}</b>
			</Typography>
		);
	};

	const { conversation } = useContext(MessageContext)!;
	const router = useRouter();
	const { id } = router.query;
	const listMember = conversation?.members || [];

	// listen typing event from socket io
	const [typingList, setTypingList] = useState<any[]>([]);
	useEffect(() => {
		if (id) {
			window.socket.on('typingMessage', ({ senderId }: any) => {
				console.log('typingMessage', senderId);

				const typer = listMember.find((m: any) => m?.user?._id === senderId);
				setTypingList((prev) => [...prev, typer]);
			});

			window.socket.on('stopTypingMessage', ({ senderId }: any) => {
				setTypingList((prev) => prev.filter(({ user: { _id } }: any) => _id !== senderId));
			});
		}

		return () => {
			window.socket.off('typingMessage');
			window.socket.off('stopTypingMessage');
		};
	}, [id]);

	return (
		<>
			<Collapse in={typingList.length > 0} mountOnEnter unmountOnExit>
				<TypingMessage typingList={typingList} />
			</Collapse>

			{/* File Preview */}
			<Collapse in={filesSelected.length > 0}>
				{renderCountFilesSelected()}
				<Stack direction="row" spacing={1} sx={{ p: 1 }} overflow="auto hidden">
					{renderFilesSelected()}
				</Stack>
			</Collapse>

			<MessageInput onChooseFile={open} onSend={onSend} />
		</>
	);
}
