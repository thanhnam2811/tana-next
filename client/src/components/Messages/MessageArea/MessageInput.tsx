import { MyIconButton } from '@components/MUI';
import { useUserStore } from '@store';
import { Stack, TextField } from '@mui/material';
import { showIncomingAlert } from '@utils/common';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { BsCursorFill, BsEmojiHeartEyesFill, BsFillFileEarmarkFill } from 'react-icons/bs';

interface MessageInputProps {
	// eslint-disable-next-line no-unused-vars
	onSend: (value: string) => void;
	onChooseFile: () => void;
}

const TYPING_TIMEOUT = 1000;

export const MessageInput = ({ onSend, onChooseFile }: MessageInputProps) => {
	const router = useRouter();
	const { id } = router.query;
	const { user } = useUserStore();

	const inputRef = useRef<any>(null);
	const onSubmit = () => {
		const message = inputRef.current.value;
		if (!message?.trim()) return;

		// send message
		onSend(message);

		// clear input and focus
		inputRef.current.value = '';
		inputRef.current.focus();
	};

	const typingRef = useRef<any>(null);

	const emitStopTyping = () => {
		// emit stop typing event
		window.socket.emit('stopTypingMessage', {
			conversation: id,
			senderId: user?._id,
		});

		// clear typingRef
		typingRef.current = null;
	};

	const emitTyping = () => {
		// if typingRef is null, emit typing event
		if (!typingRef.current)
			window.socket.emit('typingMessage', {
				conversation: id,
				senderId: user?._id,
			});
		// if typingRef is not null, clear timeout
		else clearTimeout(typingRef.current);

		// set timeout to emit stop typing event
		typingRef.current = setTimeout(emitStopTyping, TYPING_TIMEOUT);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		// submit on enter key
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			onSubmit();

			// emit stop typing event
			emitStopTyping();
		}

		// emit typing event
		else emitTyping();
	};

	return (
		<Stack direction="row" alignItems="center">
			<MyIconButton
				tooltip="Chọn ảnh, video, tập tin"
				Icon={BsFillFileEarmarkFill}
				variant="color"
				onClick={onChooseFile}
				sx={{ alignSelf: 'flex-end' }}
			/>
			<MyIconButton
				tooltip="Chọn biểu cảm"
				Icon={BsEmojiHeartEyesFill}
				variant="color"
				onClick={showIncomingAlert}
				sx={{ alignSelf: 'flex-end' }}
			/>
			<TextField
				inputRef={inputRef}
				multiline
				fullWidth
				maxRows={4}
				placeholder="Nhập tin nhắn..."
				size="small"
				onKeyDown={handleKeyDown}
				onFocus={emitTyping}
			/>
			<MyIconButton
				tooltip="Gửi"
				Icon={BsCursorFill}
				variant="color"
				onClick={onSubmit}
				sx={{ alignSelf: 'flex-end' }}
			/>
		</Stack>
	);
};
