import { PostMedia } from '@components/Card/PostCard';
import { DraftEditor } from '@components/Editor';
import { IPost, PostType } from '@interfaces';
import { IMedia } from '@interfaces/common';
import InsertPhotoTwoTone from '@mui/icons-material/InsertPhotoTwoTone';
import LocationCityTwoTone from '@mui/icons-material/LocationCityTwoTone';
import SlideshowTwoTone from '@mui/icons-material/SlideshowTwoTone';
import { LoadingButton } from '@mui/lab';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { fileApi } from '@utils/api';
import { randomString } from '@utils/common';
import { Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { HiPlusCircle } from 'react-icons/hi';

interface Props {
	data?: PostType;
	open: boolean;
	onClose: () => void;
	onCreate?: (data: any) => Promise<void>;
	onUpdate?: (id: string, data: any) => Promise<void>;
}

interface IMediaFile extends IMedia {
	file?: File;
}

export const PostModal = ({ data, open, onClose, onCreate, onUpdate }: Props) => {
	const isUpdate = !!data;

	const mediaInputRef = useRef<HTMLInputElement>(null);
	const [listMedia, setListMedia] = useState<IMediaFile[]>([]);

	const handleAddMedia = (files: FileList | null) => {
		if (!files) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const media: IMediaFile = {
				_id: randomString(10),
				link: URL.createObjectURL(file),
				file,
			};
			setListMedia((prev) => [...prev, media]);
		}

		mediaInputRef.current!.value = ''; // reset input
	};

	const handleDeleteMedia = (id: string) => {
		setListMedia((prev) => prev.filter((item) => item._id !== id));
	};

	const {
		control,
		handleSubmit,
		formState: { isSubmitting },
		reset,
	} = useForm<IPost & { media: string[] }>();

	useEffect(() => {
		if (!data?._id) {
			setListMedia([]);
			reset();
		} else {
			setListMedia(data.media || []);

			reset({
				...data,
				// Gán lại media thành mảng id để submit
				media: data.media?.map((item) => item._id) || [],
			});
		}
	}, [data, reset]);

	const handleClose = () => {
		reset();
		onClose();
	};

	const onSubmit = async (data: IPost & { media: string[] }) => {
		// Tách media cũ và file mới
		const oldMedia: IMediaFile[] = [],
			newFiles: File[] = [];
		listMedia.forEach((item) => {
			if (item.file) newFiles.push(item.file);
			else oldMedia.push(item);
		});

		// Gán lại media
		data.media = oldMedia.map(({ _id }) => _id);

		// Nếu có file mới thì upload
		if (newFiles.length) {
			const toastId = toast.loading('Đang tải lên ảnh, video...');
			try {
				const {
					data: { files },
				} = await fileApi.upload(newFiles);

				data.media = [...data.media, ...files.map(({ _id }) => _id)];
				toast.success('Tải lên ảnh, video thành công', { id: toastId });
			} catch (error) {
				toast.error('Tải lên ảnh, video thất bại', { id: toastId });
				return;
			}
		}

		// Nếu là update thì gọi hàm onUpdate
		if (isUpdate) {
			await onUpdate?.(data._id, data);
			handleClose();
			return;
		}

		// Nếu là create thì gọi hàm onCreate
		await onCreate?.(data);
		handleClose();
	};

	return (
		<Modal
			open={open}
			onCancel={handleClose}
			title="Bài viết mới"
			footer={[
				<LoadingButton
					key="submit"
					variant="contained"
					onClick={handleSubmit(onSubmit)}
					loading={isSubmitting}
					loadingPosition="start"
					startIcon={<HiPlusCircle />}
				>
					Đăng
				</LoadingButton>,
			]}
		>
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
			<Box sx={{ border: '1px dashed #ccc' }} p={1} mt={2} borderRadius={1} gap={1}>
				<Box display="flex" alignItems="center" gap={1}>
					<input
						ref={mediaInputRef}
						type="file"
						hidden
						onChange={(e) => handleAddMedia(e.target.files)}
						multiple
						accept="image/*, video/*"
					/>
					<Typography variant="body2">Thêm ảnh, video, vị trí,...</Typography>

					<IconButton color="success" sx={{ ml: 'auto' }} onClick={() => mediaInputRef.current?.click()}>
						<InsertPhotoTwoTone />
					</IconButton>

					<IconButton color="info" onClick={() => mediaInputRef.current?.click()}>
						<SlideshowTwoTone />
					</IconButton>

					<IconButton color="warning" onClick={() => alert('Chức năng đang phát triển')}>
						<LocationCityTwoTone />
					</IconButton>
				</Box>

				<Collapse in={!!listMedia.length}>
					<PostMedia media={listMedia} onDelete={handleDeleteMedia} showAll />
				</Collapse>
			</Box>
		</Modal>
	);
};
