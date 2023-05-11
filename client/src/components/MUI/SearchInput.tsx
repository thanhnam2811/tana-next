import { useRef } from 'react';

import { IconButton, TextField, TextFieldProps } from '@mui/material';
import { FiSearch } from 'react-icons/fi';

interface Props {
	// eslint-disable-next-line no-unused-vars
	onSearch?: (value: string) => void;
	timeDelays?: number;
}

export function SearchInput({ onSearch, timeDelays = 1000, ...props }: Props & TextFieldProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	const preValue = useRef<string>('');
	const handleSearch = () => {
		const value = inputRef.current?.value || '';
		if (preValue.current === value) return;

		preValue.current = value;
		onSearch?.(value);
	};

	// Debouce
	const typingRef = useRef<any>();
	const handleTextChange = () => {
		if (typingRef.current) clearTimeout(typingRef.current);

		typingRef.current = setTimeout(() => {
			handleSearch();
		}, timeDelays);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSearch();
	};

	return (
		<TextField
			{...props}
			onChange={handleTextChange}
			onKeyDown={handleKeyDown}
			inputRef={inputRef}
			InputProps={{
				endAdornment: (
					<IconButton onClick={handleSearch}>
						<FiSearch />
					</IconButton>
				),
			}}
		/>
	);
}
