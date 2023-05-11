import { styled, Tab as MuiTab, Tabs as MuiTabs } from '@mui/material';

const Tab = styled(MuiTab)({
	textTransform: 'none',
	justifyContent: 'flex-start',
	'&.Mui-selected *': {
		color: 'white',
		transition: 'all .3s ease-in-out',
	},
	'&:hover': {
		transform: 'scale(1.02)',
		color: 'black',
	},
	'&.Mui-selected, &.Mui-selected:hover': {
		color: 'white',
		transform: 'scale(1)',
	},
	zIndex: 10,
	transition: 'all .3s ease-in-out',
	minHeight: 'auto',
	minWidth: 'auto',
	padding: 16,
	width: '100%',
	maxWidth: '100%',
	flexDirection: 'row',
});

const Tabs = styled(MuiTabs)({
	minHeight: 'auto',
	'& .MuiTabs-indicator': {
		width: '100%',
		zIndex: 0,
		borderRadius: 12,
	},
});

export const Navigate = { Tab, Tabs };
