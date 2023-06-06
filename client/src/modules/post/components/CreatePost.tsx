import { UserAvatar } from '@modules/user/components';
import { FetcherType } from '@common/hooks';
import { PostFormType, PostType } from '@common/types';
import { useAuth } from '@modules/auth/hooks';
import { postApi } from '@utils/api';
import { COLORS } from '@utils/theme';
import { Button, Card, CardProps, Input } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';
import { PostModal } from './PostModal';

interface Props {
	fetcher: FetcherType<PostType>;
}

export function CreatePost({ fetcher, ...cardProps }: Props & CardProps) {
	const { authUser } = useAuth();

	const handleAddPost = async (data: PostFormType) => {
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
		<>
			<PostModal open={openModal} onClose={handleCloseModal} onCreate={handleAddPost} />

			<Card
				{...cardProps}
				bodyStyle={{
					padding: 16,
					...cardProps?.headStyle,
				}}
				actions={[
					<Button key="photo" type="text" icon={<HiPhoto color={COLORS.success} />}>
						Ảnh
					</Button>,

					<Button key="video" type="text" icon={<HiPlayCircle color={COLORS.info} />}>
						Video
					</Button>,

					<Button key="location" type="text" icon={<HiMapPin color={COLORS.warning} />}>
						Vị trí
					</Button>,
					...(cardProps?.actions ?? []),
				]}
				onClick={handleOpenModal}
			>
				<Card.Meta
					avatar={<UserAvatar user={authUser!} />}
					title={
						<Input.TextArea placeholder="Bạn đang nghĩ gì?" bordered={false} rows={2} readOnly autoSize />
					}
				/>
			</Card>
		</>
	);
}
