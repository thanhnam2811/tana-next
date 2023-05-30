import { WhiteBox } from '@components/Box';
import { PostModal } from '@components/Modal';
import { InfinitFetcherType } from '@hooks';
import { PostType } from '@interfaces';
import InsertPhotoTwoTone from '@mui/icons-material/InsertPhotoTwoTone';
import LocationCityTwoTone from '@mui/icons-material/LocationCityTwoTone';
import SlideshowTwoTone from '@mui/icons-material/SlideshowTwoTone';
import { Avatar, Box, Button, TextField, styled } from '@mui/material';
import { useUserStore } from '@store';
import { postApi } from '@utils/api';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const StatusInput = styled(TextField)({
	// hide outline
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			border: 'none !important',
		},
		'&:hover fieldset': {
			border: 'none !important',
		},
		'&.Mui-focused fieldset': {
			border: 'none !important',
		},
	},
});

interface Props {
	fetcher: InfinitFetcherType;
}

export function CreatePost({ fetcher }: Props) {
	const { user } = useUserStore();

	const handleAddPost = async (data: PostType) => {
		const toastId = toast.loading('Đang thêm bài viết...');
		try {
			const res = await postApi.create(data);
			fetcher.addData(res.data);
			toast.success('Thêm bài viết thành công', { id: toastId });
		} catch (error: any) {
			toast.error(error.toString(), { id: toastId });
		}
	};

	const [openModal, setOpenModal] = useState(false);
	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);
	return (
		<WhiteBox sx={{ height: 'auto', mb: 2 }}>
			<PostModal open={openModal} onClose={handleCloseModal} onCreate={handleAddPost} />

			<StatusInput
				fullWidth
				placeholder="Bạn đang nghĩ gì?"
				InputProps={{
					startAdornment: <Avatar sx={{ mr: 1 }} src={user?.profilePicture!.link as string} />,
					readOnly: true,
				}}
				onClick={handleOpenModal}
			/>

			<Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1 }}>
				<Button
					variant="text"
					onClick={() => toast('Chức năng đang được phát triển', { icon: '🚧', id: 'post-photo' })}
					startIcon={<InsertPhotoTwoTone />}
					fullWidth
					color="success"
				>
					Ảnh
				</Button>

				<Button
					variant="text"
					onClick={() => toast('Chức năng đang được phát triển', { icon: '🚧', id: 'post-video' })}
					startIcon={<SlideshowTwoTone />}
					fullWidth
					color="info"
				>
					Video
				</Button>

				<Button
					variant="text"
					onClick={() => toast('Chức năng đang được phát triển', { icon: '🚧', id: 'post-location' })}
					startIcon={<LocationCityTwoTone />}
					fullWidth
					color="warning"
				>
					Vị trí
				</Button>
			</Box>
		</WhiteBox>
	);
}
