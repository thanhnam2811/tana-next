import { UserAvatar } from '@components/v2/Avatar';
import { PostModal } from '@components/v2/Modal';
import { InfinitFetcherType } from '@hooks';
import { PostType } from '@interfaces';
import { useUserStore } from '@store';
import { postApi } from '@utils/api';
import { COLORS } from '@utils/theme';
import { Button, Card, CardProps, Input } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';

interface Props {
	fetcher: InfinitFetcherType<PostType>;
}

export function CreatePost({ fetcher, ...cardProps }: Props & CardProps) {
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
		<>
			<PostModal open={openModal} onClose={handleCloseModal} onCreate={handleAddPost} />

			<Card
				{...cardProps}
				headStyle={{
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
					avatar={<UserAvatar user={user!} />}
					title={
						<Input.TextArea placeholder="Bạn đang nghĩ gì?" bordered={false} rows={2} readOnly autoSize />
					}
				/>
			</Card>
		</>
	);
}
