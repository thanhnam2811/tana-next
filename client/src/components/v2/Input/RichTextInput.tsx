import { Button, Card, CardProps, Space } from 'antd';
import { Editor, EditorState, RichUtils } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { useState } from 'react';
import { GrOrderedList, GrUnorderedList } from 'react-icons/gr';

interface IBaseStyle {
	label: React.ReactNode;
	style: string;
}

const blockStyles: IBaseStyle[] = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: <GrUnorderedList />, style: 'unordered-list-item' },
	{ label: <GrOrderedList />, style: 'ordered-list-item' },
];

const inlineStyles: IBaseStyle[] = [
	{ label: <b>B</b>, style: 'BOLD' },
	{ label: <i>I</i>, style: 'ITALIC' },
	{ label: <u>U</u>, style: 'UNDERLINE' },
];

interface IStyle extends IBaseStyle {
	type: 'inline' | 'block';
}

const styles: IStyle[] = [
	...inlineStyles.map<IStyle>((style) => ({ ...style, type: 'inline' })),
	...blockStyles.map<IStyle>((style) => ({ ...style, type: 'block' })),
];

interface EditorProps {
	value?: string;
	onChange?: (value: string) => void;
	placeholder?: string;
}

export const RichTextInput = ({ value = '', onChange, placeholder, ...props }: EditorProps & CardProps) => {
	const [editorState, setEditorState] = useState(EditorState.createWithContent(stateFromHTML(value)));

	const handleEditorChange = (newEditorState: EditorState) => {
		const contentState = newEditorState.getCurrentContent();
		const contentStateString = stateToHTML(contentState);
		setEditorState(newEditorState);
		onChange?.(contentStateString);
	};

	const handleKeyCommand = (command: string, editorState: EditorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleEditorChange(newState);
			return 'handled';
		}
		return 'not-handled';
	};

	const toggleBlockType = (blockType: string) =>
		handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
	const isBlockActive = (blockType: string) => {
		const selection = editorState.getSelection();
		const block = editorState.getCurrentContent().getBlockForKey(selection.getStartKey());
		return block.getType() === blockType;
	};

	const toggleInlineStyle = (inlineStyle: string) =>
		handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	const isInlineStyleActive = (inlineStyle: string) => editorState.getCurrentInlineStyle().has(inlineStyle);

	const toggleStyle = (s: IStyle) => (s.type === 'block' ? toggleBlockType(s.style) : toggleInlineStyle(s.style));
	const isStyleActive = (s: IStyle) => (s.type === 'block' ? isBlockActive(s.style) : isInlineStyleActive(s.style));

	return (
		<Card
			headStyle={{ padding: 16 }}
			bodyStyle={{ padding: 16 }}
			title={
				<Space>
					{styles.map((s) => (
						<Button
							key={s.style}
							onClick={() => toggleStyle(s)}
							type={isStyleActive(s) ? 'primary' : 'default'}
							style={{ width: 32, height: 32, padding: 0 }}
						>
							{s.label}
						</Button>
					))}
				</Space>
			}
			{...props}
		>
			<Editor
				placeholder={placeholder}
				editorState={editorState}
				onChange={handleEditorChange}
				handleKeyCommand={handleKeyCommand}
			/>
		</Card>
	);
};

interface ViewerProps {
	content: string;
}

export const RichTextViewer = function Viewer({ content }: ViewerProps) {
	const contentState = stateFromHTML(content);
	const editorState = EditorState.createWithContent(contentState);

	return (
		<Editor
			editorState={editorState}
			readOnly={true}
			onChange={() => {
				// Do nothing
			}}
		/>
	);
};
