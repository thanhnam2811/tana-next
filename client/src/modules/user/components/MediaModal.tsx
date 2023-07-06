import { Badge, Button, Card, Form, Image, Input, List, Modal, Space } from 'antd';
import { useRef, useState } from 'react';
import { randomUtil } from '@common/utils';
import { MediaType } from '@common/types';
import { HiPlus, HiTrash } from 'react-icons/hi2';

interface Props {
	open: boolean;
	onClose: () => void;
	onSubmit: (media: MediaType[]) => Promise<void>;
}

export function MediaModal({ open, onClose, onSubmit }: Props) {
	const [form] = Form.useForm<{ media: MediaType[] }>();

	const [submitting, setSubmitting] = useState(false);
	const handleSubmit = async ({ media }: { media: MediaType[] }) => {
		setSubmitting(true);
		await onSubmit(media);

		setSubmitting(false);
		form.resetFields();
	};

	return (
		<Modal
			title="Thêm ảnh/video vào album"
			open={open}
			onCancel={onClose}
			width={600}
			onOk={form.submit}
			confirmLoading={submitting}
		>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				<Form.Item name="media" rules={[{ required: true, message: 'Vui lòng chọn ảnh/video' }]}>
					<ListMedia />
				</Form.Item>
			</Form>
		</Modal>
	);
}

interface ListMediaProps {
	value?: MediaType[];
	onChange?: (value: MediaType[]) => void;
}
const ListMedia = ({ value = [], onChange }: ListMediaProps) => {
	const mediaInputRef = useRef<HTMLInputElement>(null);

	const handleAddMedia = (files: FileList | null) => {
		if (!files) return;

		const medias: MediaType[] = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const media: MediaType = {
				_id: randomUtil.string(10),
				link: URL.createObjectURL(file),
				file,
			};
			medias.push(media);
		}
		onChange?.([...value, ...medias].slice(0, 10)); // Chỉ cho phép tối đa 10 ảnh
	};
	const handleDeleteMedia = (id: string) => onChange?.(value.filter((item) => item._id !== id));

	return (
		<Image.PreviewGroup>
			<Form.Item hidden>
				<input
					ref={mediaInputRef}
					type="file"
					hidden
					onChange={(e) => handleAddMedia(e.target.files)}
					multiple
					accept="image/*, video/*"
				/>
			</Form.Item>

			<List
				header={
					<Space style={{ width: '100%', justifyContent: 'space-between' }}>
						<span>Danh sách ảnh</span>

						<Button size="small" onClick={() => mediaInputRef.current?.click()} icon={<HiPlus />}>
							Thêm (tối đa 10 ảnh)
						</Button>
					</Space>
				}
				dataSource={value}
				grid={{ gutter: 16, column: 3 }}
				renderItem={(item, index) => (
					<List.Item>
						<Card
							cover={
								<Badge
									count={
										<Button
											size="small"
											shape="circle"
											danger
											icon={<HiTrash />}
											onClick={() => handleDeleteMedia(item._id)}
										/>
									}
									offset={[0, 0]}
								>
									<Image
										src={item.link}
										alt={item.description}
										style={{ aspectRatio: '1', objectFit: 'cover' }}
									/>
								</Badge>
							}
							bodyStyle={{ padding: 0 }}
						>
							<Input.TextArea
								placeholder="Nhập mô tả"
								autoSize={{ minRows: 2, maxRows: 4 }}
								value={item.description}
								onChange={(e) => {
									const { value: desc } = e.target;
									const newList = [...value];
									newList[index].description = desc;
									onChange?.(newList);
								}}
								bordered={false}
							/>
						</Card>
					</List.Item>
				)}
			/>
		</Image.PreviewGroup>
	);
};
