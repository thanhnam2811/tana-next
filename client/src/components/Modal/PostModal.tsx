import { DraftEditor } from '@components/Editor';
import { Close } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
	Alert,
	Box,
	Collapse,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grow,
	IconButton,
} from '@mui/material';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { HiPlusCircle } from 'react-icons/hi';

const Transition = React.forwardRef(function Transition(props: { children: JSX.Element }, ref) {
	return (
		<Grow ref={ref} {...props}>
			{props.children}
		</Grow>
	);
});

interface Props {
	data?: any;
	open: boolean;
	onClose: () => void;
	// eslint-disable-next-line no-unused-vars
	onCreate?: (data: any) => Promise<void>;
	// eslint-disable-next-line no-unused-vars
	onUpdate?: (id: string, data: any) => Promise<void>;
}

export const ModalPost = ({ data, open, onClose, onCreate, onUpdate }: Props) => {
	const isUpdate = !!data;

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm();

	useEffect(() => {
		reset(data);
	}, [data, reset]);

	const handleClose = () => {
		reset();
		onClose();
	};

	const onSubmit = (data: any) =>
		isUpdate ? onUpdate?.(data._id, data).then(handleClose) : onCreate?.(data).then(handleClose);

	return (
		<Dialog TransitionComponent={Transition} open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle sx={{ m: 2, p: 0, mb: 0 }}>
				Bài viết mới
				<IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}>
					<Close />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ p: 0, overflow: 'auto' }}>
				<Box component="form" onSubmit={handleSubmit(onSubmit)} height="100%">
					<Controller
						name="content"
						control={control}
						rules={{
							validate: (value) => {
								if (!value?.trim()) return 'Nội dung không được để trống';
							},
						}}
						render={({ field: { value, onChange } }) => <DraftEditor value={value} onChange={onChange} />}
					/>
				</Box>
			</DialogContent>
			<DialogActions sx={{ alignItems: 'flex-end', p: 2, pt: 0 }}>
				<Collapse in={!!errors.content} sx={{ mr: 'auto', whiteSpace: 'nowrap' }} orientation="horizontal">
					<Alert severity="error">{errors.content?.message as string}</Alert>
				</Collapse>
				<LoadingButton
					variant="contained"
					onClick={handleSubmit(onSubmit)}
					loading={isSubmitting}
					loadingPosition="start"
					startIcon={<HiPlusCircle />}
				>
					Đăng
				</LoadingButton>
			</DialogActions>
		</Dialog>
	);
};
