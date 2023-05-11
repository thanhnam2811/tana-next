import { ReactElement } from 'react';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Typography,
	useTheme,
} from '@mui/material';
import { IoChevronDown } from 'react-icons/io5';
import { IconType } from 'react-icons/lib';
import Image from 'next/image';

export interface MenuOptionProps {
	label: string;
	subLabel?: string;
	img?: string;
	Icon?: IconType | (() => ReactElement);
	iconSize?: number;
	onClick: () => any;
}

export function MenuOptions({ label, subLabel, img, Icon, iconSize = 20, onClick }: MenuOptionProps) {
	const theme = useTheme();

	return (
		<ListItemButton
			sx={{
				borderRadius: '16px',
				transition: 'all 0.1s ease-in-out',
				'& .MuiListItemIcon-root': {},
				'&:hover': {
					color: theme.palette.primary.main,
					transform: 'scale(1.02)',
				},
			}}
			onClick={onClick}
		>
			<ListItemIcon
				sx={{
					minWidth: 0,
					pr: '16px',
					color: 'inherit',
				}}
			>
				{Icon && <Icon style={{ color: 'inherit' }} size={iconSize} />}
				{img && <Image src={img} alt={label} width={iconSize} height={iconSize} />}
			</ListItemIcon>

			<ListItemText
				primary={label}
				primaryTypographyProps={{
					fontSize: 14,
					fontWeight: 700,
				}}
				secondary={subLabel}
				secondaryTypographyProps={{
					fontSize: 12,
					fontWeight: 500,
				}}
			/>
		</ListItemButton>
	);
}

interface Props {
	label?: string;
	options?: MenuOptionProps[];
}

export function Menu({ label, options = [] }: Props) {
	return (
		<Accordion disableGutters sx={{ boxShadow: 'none', '&::before': { display: 'none' } }}>
			<AccordionSummary expandIcon={<IoChevronDown />}>
				<Typography fontSize={16} fontWeight={700}>
					{label}
				</Typography>
			</AccordionSummary>

			<AccordionDetails sx={{ py: 0 }}>
				<List disablePadding>
					{options?.map((option, index) => (
						<MenuOptions key={index} {...option} />
					))}
				</List>
			</AccordionDetails>
		</Accordion>
	);
}
