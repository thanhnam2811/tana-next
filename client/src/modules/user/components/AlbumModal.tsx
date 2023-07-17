import { AlbumFormType, AlbumType, UserType } from '@modules/user/types';
import { Badge, Button, Card, Form, Image, Input, List, Modal, Select, Space, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { fileUtil, randomUtil } from '@common/utils';
import { MediaType } from '@common/types';
import { HiPlus, HiTrash } from 'react-icons/hi2';
import { privacyOptions } from '@assets/data';
import { SelectApi } from '@common/components/Input';
import { useFetcher } from '@common/hooks';
import { UserAvatar } from '@modules/user/components';

interface Props {
	open: boolean;
	onClose: () => void;
	album?: AlbumType;
	onSubmit: (data: AlbumFormType) => Promise<void>;
}

export function AlbumModal({ open, onClose, album, onSubmit }: Props) {
	const [form] = Form.useForm<AlbumFormType>();
	const privacyValue = Form.useWatch(['privacy', 'value'], form);

	useEffect(() => {
		if (album) form.setFieldsValue({ ...album, media: [] });
		else form.resetFields();
	}, [album]);

	const [submitting, setSubmitting] = useState(false);
	const handleSubmit = async (data: AlbumFormType) => {
		setSubmitting(true);
		await onSubmit(data);
		setSubmitting(false);
		form.resetFields();
	};

	const friendFetcher = useFetcher<UserType>({ api: `/users/searchUser/friends` });

	return (
		<Modal
			title={album ? 'Chỉnh sửa album' : 'Tạo mới album'}
			open={open}
			onCancel={onClose}
			width={600}
			onOk={form.submit}
			confirmLoading={submitting}
		>
			<Form form={form} layout="vertical" onFinish={handleSubmit}>
				<Form.Item
					name="name"
					label="Tên album"
					rules={[{ required: true, message: 'Vui lòng nhập tên album' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item name={['privacy', 'value']} label="Quyền riêng tư" initialValue={privacyOptions[0].value}>
					<Select showSearch={false}>
						{privacyOptions.map((item) => (
							<Select.Option key={item.value} value={item.value}>
								<Space>
									<item.RIcon />

									{item.label}
								</Space>
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				{privacyValue === 'includes' && (
					<Form.Item
						name={['privacy', 'includes']}
						label="Danh sách những người được xem"
						rules={[{ required: true, message: 'Vui lòng chọn người được xem' }]}
					>
						<SelectApi<UserType>
							fetcher={friendFetcher}
							mode="multiple"
							toOption={(item) => ({ value: item._id, label: item.fullname })}
							renderOption={(item) => (
								<Space>
									<UserAvatar user={item} avtSize={20} />

									<Typography.Text>{item.fullname}</Typography.Text>
								</Space>
							)}
						/>
					</Form.Item>
				)}

				{privacyValue === 'excludes' && (
					<Form.Item
						name={['privacy', 'excludes']}
						label="Danh sách những người không được xem"
						rules={[{ required: true, message: 'Vui lòng chọn người không được xem' }]}
					>
						<SelectApi<UserType>
							fetcher={friendFetcher}
							mode="multiple"
							toOption={(item) => ({ value: item._id, label: item.fullname })}
							renderOption={(item) => (
								<Space>
									<UserAvatar user={item} avtSize={20} />

									<Typography.Text>{item.fullname}</Typography.Text>
								</Space>
							)}
						/>
					</Form.Item>
				)}

				{!album && (
					<Form.Item name="media" noStyle>
						<ListMedia />
					</Form.Item>
				)}
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
					accept={[
						...fileUtil.acceptedImageTypes.map((ext) => `.${ext}`),
						...fileUtil.acceptedVideoTypes.map((ext) => `.${ext}`),
					].join(',')}
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
				renderItem={(item, index) => {
					const fileName = item.file?.name || item.link.split('/').pop();
					const isVideo = !!(fileName && fileUtil.isVideo(fileName));

					return (
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
										{isVideo ? (
											<video
												src={item.link}
												style={{
													aspectRatio: '1',
													objectFit: 'contain',
													width: '100%',
													height: '100%',
												}}
												controls
											/>
										) : (
											<Image
												src={item.link}
												alt={item.description}
												style={{
													aspectRatio: '1',
													objectFit: 'cover',
													width: '100%',
													height: '100%',
												}}
											/>
										)}
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
					);
				}}
			/>
		</Image.PreviewGroup>
	);
};
