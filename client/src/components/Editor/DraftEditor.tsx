import { Box, Button, ButtonProps } from '@mui/material';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { useState } from 'react';
import { GrOrderedList, GrUnorderedList } from 'react-icons/gr';

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: <GrUnorderedList size={22} />, style: 'unordered-list-item' },
	{ label: <GrOrderedList size={22} />, style: 'ordered-list-item' },
];

const INLINE_STYLES = [
	{ label: <b>B</b>, style: 'BOLD' },
	{ label: <i>I</i>, style: 'ITALIC' },
	{ label: <u>U</u>, style: 'UNDERLINE' },
];

const ToolbarButton = ({ active, ...props }: ButtonProps & { active: boolean }) => (
	<Button
		variant={active ? 'contained' : 'text'}
		size="small"
		sx={{
			textTransform: 'none',
			fontSize: '1rem',
			fontWeight: 'normal',
			borderRadius: '0.25rem',
			p: '0',
			minWidth: '2rem',
			minHeight: '2rem',
		}}
		color={active ? 'primary' : 'secondary'}
		{...props}
	/>
);

interface EditorProps {
	value: string;
	// eslint-disable-next-line no-unused-vars
	onChange: (value: string) => void;
	placeholder?: string;
}

export const DraftEditor: React.FC<EditorProps> = ({ value = '', onChange, placeholder = 'Nhập nội dung...' }) => {
	const [editorState, setEditorState] = useState(EditorState.createWithContent(stateFromHTML(value)));

	const handleEditorChange = (newEditorState: EditorState) => {
		const contentState = newEditorState.getCurrentContent();
		const contentStateString = stateToHTML(contentState);
		setEditorState(newEditorState);
		onChange(contentStateString);
	};

	const handleKeyCommand = (command: string, editorState: EditorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleEditorChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};

	const toggleBlockType = (blockType: string) => {
		handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
	};
	const isBlockActive = (blockType: string) => {
		const selection = editorState.getSelection();
		const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
		return block.getType() === blockType;
	};

	const toggleInlineStyle = (inlineStyle: string) => {
		handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	};
	const isInlineStyleActive = (inlineStyle: string) => editorState.getCurrentInlineStyle().has(inlineStyle);

	return (
		<Box p={2}>
			<Box
				display="flex"
				alignItems="center"
				gap={1}
				flexWrap="wrap"
				border="1px dashed #ccc"
				p={1}
				sx={{
					borderTopLeftRadius: '0.5rem',
					borderTopRightRadius: '0.5rem',
				}}
			>
				{INLINE_STYLES.map((type) => (
					<ToolbarButton
						key={type.style}
						onClick={() => toggleInlineStyle(type.style)}
						type="button"
						active={isInlineStyleActive(type.style)}
					>
						{type.label}
					</ToolbarButton>
				))}

				{BLOCK_TYPES.map((type) => (
					<ToolbarButton
						key={type.style}
						onClick={() => toggleBlockType(type.style)}
						active={isBlockActive(type.style)}
						type="button"
					>
						{type.label}
					</ToolbarButton>
				))}
			</Box>
			<Box
				sx={{
					border: '1px dashed #ccc',
					borderTop: 'none',
					borderBottomLeftRadius: '0.5rem',
					borderBottomRightRadius: '0.5rem',
					p: '0.5rem',
					minHeight: '10rem',
				}}
			>
				<Editor
					placeholder={placeholder}
					editorState={editorState}
					onChange={handleEditorChange}
					handleKeyCommand={handleKeyCommand}
				/>
			</Box>
		</Box>
	);
};

interface ViewerProps {
	content: string;
}

export const DraftViewer: React.FC<ViewerProps> = ({ content }) => {
	const contentState = stateFromHTML(content);
	const editorState = EditorState.createWithContent(contentState);

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	return <Editor editorState={editorState} readOnly={true} onChange={() => {}} />;
};
