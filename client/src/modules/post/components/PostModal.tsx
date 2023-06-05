import { PrivacyDropdown } from '@components/Button';
import { RichTextInput } from '@components/v2/Input';
import { PostFormType, PostType } from '@interfaces';
import { IMedia } from '@interfaces/common';
import { Collapse } from '@mui/material';
import { fileApi } from '@utils/api';
import { randomString } from '@utils/common';
import { COLORS } from '@utils/theme';
import { Button, Card, Form, Modal, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiMapPin, HiPhoto, HiPlayCircle } from 'react-icons/hi2';
import { PostMedia } from './PostCard';

interface Props {
	data?: PostType;
	open: boolean;
	onClose: () => void;
	onCreate?: (data: PostFormType) => Promise<void>;
	onUpdate?: (id: string, data: PostFormType) => Promise<void>;
}

interface IMediaFile extends IMedia {
	file?: File;
}

export const PostModal = ({ data, open, onClose, onCreate, onUpdate }: Props) => {
	const isEdit = !!data?._id; // Nếu có id thì là edit

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

	const [form] = Form.useForm<PostFormType>();
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		if (!data?._id) {
			resetData();
		} else {
			setListMedia(data.media || []);

			form.setFieldsValue({
				...data,
				// Gán lại media thành mảng id để submit
				media: data.media?.map((item) => item._id) || [],
			});
		}
	}, [data]);

	const resetData = () => {
		form.resetFields();
		setListMedia([]);
	};

	const onSubmit = async (data: PostFormType) => {
		setSubmitting(true);

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
			} catch (error: any) {
				toast.error(error.message || error.toString(), { id: toastId });
				return;
			}
		}

		// Nếu là update thì gọi hàm onUpdate
		if (isEdit) {
			await onUpdate?.(data._id!, data);
		}

		// Nếu là create thì gọi hàm onCreate
		else {
			await onCreate?.(data);
		}

		// Reset form, đóng modal
		resetData();
		onClose();
		setSubmitting(false); // Tắt loading
	};

	return (
		<Modal
			open={open}
			onCancel={onClose}
			title={isEdit ? 'Chỉnh sửa bài viết' : 'Thêm bài viết'}
			footer={[
				<Button key="submit" type="primary" onClick={form.submit} loading={submitting}>
					{isEdit ? 'Lưu' : 'Đăng'}
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" onFinish={onSubmit}>
				<Form.Item name="content" rules={[{ required: true, message: 'Nội dung không được để trống' }]}>
					<RichTextInput
						placeholder="Bạn đang nghĩ gì?"
						extra={
							<Form.Item name="privacy" noStyle>
								<PrivacyDropdown
									key="privacy"
									value={form.getFieldValue('privacy')}
									onChange={(value) => form.setFieldValue('privacy', value)}
									render={(item) => <Button icon={<item.RIcon />} />}
								/>
							</Form.Item>
						}
					/>
				</Form.Item>
			</Form>

			<input
				ref={mediaInputRef}
				type="file"
				hidden
				onChange={(e) => handleAddMedia(e.target.files)}
				multiple
				accept="image/*, video/*"
			/>

			<Card
				headStyle={{ padding: 16 }}
				bodyStyle={{ padding: 0 }}
				title="Thêm ảnh, video, vị trí,..."
				extra={
					<Space>
						<Button
							type="text"
							shape="circle"
							icon={<HiPhoto color={COLORS.success} />}
							onClick={() => mediaInputRef.current?.click()}
							style={{ marginLeft: 'auto' }}
						/>

						<Button
							type="text"
							shape="circle"
							icon={<HiPlayCircle color={COLORS.info} />}
							onClick={() => mediaInputRef.current?.click()}
						/>

						<Button
							type="text"
							shape="circle"
							icon={<HiMapPin color={COLORS.warning} />}
							onClick={() => alert('Chức năng đang phát triển')}
						/>
					</Space>
				}
			>
				<Collapse in={!!listMedia.length}>
					<PostMedia media={listMedia} onDelete={handleDeleteMedia} showAll />
				</Collapse>
			</Card>
		</Modal>
	);
};
