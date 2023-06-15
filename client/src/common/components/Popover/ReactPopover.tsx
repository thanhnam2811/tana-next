import { reactOptions } from '@assets/data';
import { ReactionType } from '@common/types';
import { Avatar, Button, Popover, PopoverProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Popover.module.scss';

interface Props {
	reaction?: ReactionType;
	onReact?: (react: ReactionType) => void;
}

export function ReactPopover({ reaction: valProps, onReact: onChange, ...props }: Props & PopoverProps) {
	const [open, setOpen] = useState(false);
	const hide = () => setOpen(false);

	const [value, setValue] = useState(valProps);

	useEffect(() => {
		setValue(valProps);
	}, [valProps]);

	const handleReaction = (reaction: ReactionType) => {
		setValue(reaction === value ? undefined : reaction); // toggle reaction if click again
		onChange?.(reaction);
		hide(); //close popover
	};

	return (
		<Popover
			overlayInnerStyle={{ padding: 4, borderRadius: 20 }}
			content={
				<Space className={styles.react_icon_container}>
					{reactOptions.map((react) => {
						const active = react.value === value;
						return (
							<Button
								className={styles.react_icon}
								key={react.value}
								onClick={() => handleReaction(react.value)}
								shape="circle"
								type={active ? 'primary' : 'text'}
								icon={<Avatar src={react.img} />}
							/>
						);
					})}
				</Space>
			}
			trigger={['hover']}
			onOpenChange={setOpen}
			open={open}
			{...props}
		/>
	);
}
