import { UserFilterModal, getFilterTitle } from '@components/Modal';
import { InfinitFetcherType } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiFilter, HiSearch } from 'react-icons/hi';

interface Props {
	fetcher: InfinitFetcherType;
}
export function FilterUser({ fetcher }: Props) {
	const [showFilter, setShowFilter] = useState(false);
	const handleShowFilter = () => setShowFilter(true);
	const handleHideFilter = () => setShowFilter(false);
	const handleFilter = (data: any) => Promise.resolve(fetcher.filter(data));

	const hookForm = useForm();
	const {
		register,
		handleSubmit,
		formState: { isSubmitting },
	} = hookForm;

	const onSubmit = (data: any) => handleFilter({ ...data });

	return (
		<>
			<Stack direction="row" spacing={1} alignItems="center" component="form" onSubmit={handleSubmit(onSubmit)}>
				<TextField
					{...register('key')}
					placeholder="Nhập tên bạn bè để tìm kiếm"
					fullWidth
					size="small"
					InputProps={{
						endAdornment: (
							<LoadingButton
								loading={isSubmitting}
								variant="outlined"
								sx={{
									width: 'max-content',
									whiteSpace: 'nowrap',
									textTransform: 'none',
								}}
								startIcon={<HiSearch />}
								onClick={handleSubmit(onSubmit)}
							>
								Tìm kiếm
							</LoadingButton>
						),
						sx: { p: '2px' },
					}}
				/>
			</Stack>
			<Box mt={1} mb={2} display="flex" alignItems="center">
				<Button variant="contained" startIcon={<HiFilter />} onClick={handleShowFilter}>
					Lọc
				</Button>

				<UserFilterModal
					open={showFilter}
					onClose={handleHideFilter}
					handleFilter={handleSubmit(onSubmit)}
					hookForm={hookForm}
				/>

				<Typography sx={{ ml: 1, display: 'inline-block' }}>{getFilterTitle(fetcher.params)}</Typography>
			</Box>
		</>
	);
}
