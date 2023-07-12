import { IFile, MediaType } from '@common/types';
import { Button, Card, Form, Image, Input, Modal, Popconfirm, Typography } from 'antd';
import { HiPencil, HiTrash } from 'react-icons/hi2';
import { dateUtil } from '@common/utils';
import React, { useEffect } from 'react';

interface Props {
	media: IFile;
	onDelete?: (id: string) => void;
	onEdit?: (media: IFile) => void;
	isOwner?: boolean;
}

export const MediaCard = ({ media, onDelete, onEdit, isOwner }: Props) => {
	const handleDelete = () => onDelete?.(media._id);
	const handleEdit = () => onEdit?.(media);

	return (
		<Card
			cover={<Image src={media.link} alt={media.originalname} style={{ aspectRatio: '1', objectFit: 'cover' }} />}
			bodyStyle={{ padding: 8 }}
			actions={
				isOwner
					? [
							<Button key="edit" icon={<HiPencil />} onClick={handleEdit} />,
							<Popconfirm key="delete" title="Bạn có chắc muốn xóa ảnh này?" onConfirm={handleDelete}>
								<Button icon={<HiTrash />} danger />
							</Popconfirm>,
					  ]
					: undefined
			}
		>
			<Card.Meta
				title={media.description || <Typography.Text type="secondary">(Không có mô tả)</Typography.Text>}
				description={dateUtil.getTimeAgo(media.createdAt)}
			/>
		</Card>
	);
};

interface EditModalProps {
	open: boolean;
	media: MediaType;
	onClose: () => void;
	onSubmit: (id: string, media: MediaType) => Promise<void>;
}

MediaCard.EditModal = function EditModal({ open, media, onClose, onSubmit }: EditModalProps) {
	const [form] = Form.useForm<MediaType>();

	useEffect(() => {
		form.setFieldsValue(media);
	}, [media]);

	const handleSubmit = async () => {
		const values = await form.validateFields();
		return onSubmit(media._id, values);
	};

	return (
		<Modal
			title="Chỉnh sửa ảnh/video"
			open={open}
			onCancel={onClose}
			onOk={handleSubmit}
			okText="Lưu"
			cancelText="Hủy"
			destroyOnClose
		>
			<Form form={form} layout="vertical">
				<Form.Item name="description" label="Mô tả">
					<Input.TextArea placeholder="Nhập mô tả ảnh/video" autoSize={{ minRows: 2, maxRows: 6 }} />
				</Form.Item>
			</Form>
		</Modal>
	);
};
