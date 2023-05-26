import React, { useEffect, useState } from 'react';
import { List, ListItemButton, ListItemIcon, ListItemText, Popper } from '@mui/material';
import { HiArchive, HiBell, HiEyeOff, HiLink } from 'react-icons/hi';
import { WhiteBox } from '@components/Box';
import { IconType } from 'react-icons/lib';

interface Props {
	anchorElRef: any;
}

const listActions: {
	key: string;
	Icon: IconType;
	label: string;
	onClick: () => void;
}[] = [
	{
		key: 'archive',
		Icon: HiArchive,
		label: 'Lưu bài viết',
		onClick: () => console.log('Lưu bài viết'),
	},
	{
		key: 'subscribe',
		Icon: HiBell,
		label: 'Theo dõi bài viết',
		onClick: () => console.log('Theo dõi bài viết'),
	},
	{
		key: 'hide',
		Icon: HiEyeOff,
		label: 'Ẩn bài viết',
		onClick: () => console.log('Ẩn bài viết'),
	},
	{
		key: 'copy',
		Icon: HiLink,
		label: 'Sao chép liên kết',
		onClick: () => console.log('Sao chép liên kết'),
	},
];

export const PostAction = ({ anchorElRef }: Props) => {
	const [open, setOpen] = useState(false);

	const handleOpen = (e: any) => {
		e.stopPropagation();
		document.addEventListener('click', handleClose);
		setOpen(true);
	};

	const handleClose = () => {
		document.removeEventListener('click', handleClose);
		setOpen(false);
	};

	const handleAnchorElRefClick = (e: any) => {
		e.stopPropagation();
		if (open) {
			handleClose();
		} else {
			handleOpen(e);
		}
	};

	useEffect(() => {
		anchorElRef?.current?.addEventListener('click', handleAnchorElRefClick);

		document.addEventListener('scroll', handleClose);

		return () => {
			anchorElRef?.current?.removeEventListener('click', handleAnchorElRefClick);

			document.removeEventListener('scroll', handleClose);
		};
	}, [anchorElRef, open]);

	return (
		<Popper
			anchorEl={anchorElRef.current}
			open={open}
			placement="bottom-end"
			onClick={(e) => e.stopPropagation()} // Prevent closing popup when clicking on popup
			sx={{ zIndex: 100 }}
		>
			<WhiteBox
				sx={{
					boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;',
					overflow: 'hidden',
				}}
			>
				<List sx={{ p: 0 }}>
					{listActions.map(({ key, Icon, label, onClick }) => (
						<ListItemButton key={key} onClick={onClick}>
							<ListItemIcon sx={{ minWidth: 'auto', mr: 2 }}>
								<Icon size={20} />
							</ListItemIcon>
							<ListItemText primary={label} />
						</ListItemButton>
					))}
				</List>
			</WhiteBox>
		</Popper>
	);
};
