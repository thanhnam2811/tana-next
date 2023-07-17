import { IReactionOption, reactOptions } from '@assets/data';
import { ReactionTypeValue } from '@common/types';
import { Avatar, Button, Popover, PopoverProps, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './Popover.module.scss';
import { toast } from 'react-hot-toast';

interface Props {
	reaction?: ReactionTypeValue;
	onReact?: (react: ReactionTypeValue) => Promise<void> | void;
	renderChildren?: ({ reaction, loading }: { reaction?: IReactionOption; loading: boolean }) => React.ReactNode;
}

export function ReactPopover({
	reaction: valProps,
	onReact: onChange,
	renderChildren,
	children,
	...props
}: Props & PopoverProps) {
	const [open, setOpen] = useState(false);
	const hide = () => setOpen(false);

	const [value, setValue] = useState(valProps);
	const reaction = reactOptions.find((react) => react.value === value);

	useEffect(() => {
		setValue(valProps);
	}, [valProps]);

	const [loading, setLoading] = useState(false);
	const handleReaction = async (reaction: ReactionTypeValue) => {
		if (loading) return;

		setLoading(true);
		hide(); //close popover

		try {
			await onChange?.(reaction);
			setValue(reaction === value ? undefined : reaction); // toggle reaction if click again
		} catch (error) {
			toast.error('Có lỗi xảy ra, vui lòng thử lại sau!');
		}
		setLoading(false);
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
		>
			{renderChildren?.({ reaction, loading }) || children}
		</Popover>
	);
}
