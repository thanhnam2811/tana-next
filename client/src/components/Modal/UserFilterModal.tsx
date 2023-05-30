import { LoadingButton } from '@mui/lab';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	ToggleButton,
	ToggleButtonGroup,
	Typography,
} from '@mui/material';
import { Controller, UseFormReturn } from 'react-hook-form';

interface Props {
	open: boolean;
	onClose: () => void;
	handleFilter: () => any;
	hookForm: UseFormReturn;
}

export const UserFilterModal = ({ open, onClose, hookForm, handleFilter }: Props) => {
	const {
		control,
		formState: { isSubmitting },
		reset,
	} = hookForm;

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md">
			<DialogTitle>Lọc bạn bè</DialogTitle>

			<DialogContent>
				<Grid
					container
					sx={{
						'& .MuiToggleButton-root': {
							padding: '8px',
							textTransform: 'none',
						},
					}}
					rowGap={2}
				>
					{/*	Filter by gender*/}
					<Grid item xs={4} display="flex" alignItems="center">
						<Typography variant="h6">Giới tính:</Typography>
					</Grid>

					<Grid item xs={8}>
						<Controller
							name="gender"
							control={control}
							render={({ field: { value, onChange } }) => (
								<ToggleButtonGroup color="primary" value={value} exclusive onChange={onChange}>
									{filterOptions.gender.map(({ value, label }) => (
										<ToggleButton key={value} value={value}>
											{label}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							)}
						/>
					</Grid>

					{/*	Sort */}
					<Grid item xs={4} display="flex" alignItems="center">
						<Typography variant="h6">Sắp xếp:</Typography>
					</Grid>

					<Grid item xs={8}>
						<Controller
							name="sort"
							control={control}
							render={({ field: { value, onChange } }) => (
								<ToggleButtonGroup color="primary" value={value} exclusive onChange={onChange}>
									{filterOptions.sort.map(({ value, label }) => (
										<ToggleButton key={value} value={value}>
											{label}
										</ToggleButton>
									))}
								</ToggleButtonGroup>
							)}
						/>
					</Grid>
				</Grid>
			</DialogContent>

			<DialogActions>
				{/*	Apply filter*/}
				<LoadingButton loading={isSubmitting} variant="contained" onClick={handleFilter}>
					Lọc
				</LoadingButton>
				{/*	Cancel*/}
				<Button onClick={reset} variant="contained" color="error">
					Đặt lại
				</Button>
			</DialogActions>
		</Dialog>
	);
};

const filterOptions = {
	gender: [
		{ value: '', label: 'Tất cả' },
		{ value: 'male', label: 'Nam' },
		{ value: 'female', label: 'Nữ' },
		{ value: 'other', label: 'Khác' },
	],
	sort: [
		{ value: 'desc', label: 'Mới nhất' },
		{ value: 'asc', label: 'Cũ nhất' },
	],
};

export const getFilterTitle = (query: any = {}) => {
	const { gender, sort } = query;
	const genderLabel = filterOptions.gender.find((g) => g.value === gender)?.label || 'Tất cả';
	const sortLabel = filterOptions.sort.find((s) => s.value === sort)?.label || 'Mới nhất';
	return (
		<p>
			Giới tính: <b>{genderLabel}</b>, Sắp xếp: <b>{sortLabel}</b>
		</p>
	);
};
