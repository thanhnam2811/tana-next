import { FetcherType } from '@common/hooks';
import { useAuth } from '@modules/auth/hooks';
import { Button, Card, CardProps, Input, theme } from 'antd';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';
import { createPostApi } from '@modules/post/api';
import dynamic from 'next/dynamic';
import { PostFormType, PostType } from '@modules/post/types';

const PostModal = dynamic(() => import('./PostModal').then((mod) => mod.PostModal));
const UserAvatar = dynamic(() => import('@modules/user/components').then((mod) => mod.UserAvatar));

interface Props {
	fetcher: FetcherType<PostType>;
}

export function CreatePost({ fetcher, ...cardProps }: Props & CardProps) {
	const { authUser } = useAuth();
	const { token } = theme.useToken();

	const handleAddPost = async (data: PostFormType) => {
		const toastId = toast.loading('Đang thêm bài viết...');
		try {
			const created = await createPostApi(data);
			fetcher.addData(created);
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
					<Button key="photo" type="text" icon={<HiPhoto color={token.colorSuccess} />}>
						Ảnh
					</Button>,

					<Button key="video" type="text" icon={<HiPlayCircle color={token.colorPrimary} />}>
						Video
					</Button>,

					<Button key="location" type="text" icon={<HiMapPin color={token.colorWarning} />}>
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
