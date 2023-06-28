import { IMedia } from '@common/types/common';
import { Button, Card, Col, Image, Input, Row, RowProps, Typography } from 'antd';
import { HiX } from 'react-icons/hi';
import styles from './PostCard.module.scss';

// Layout for image
const getColumnSize = (index: number, size: number) => {
	if (size === 1) return 24;
	if (size === 2 || size === 4) return 12;
	if (size === 5) return index < 2 ? 12 : 8; // 12, 12, 8, 8, 8
	return 8;
};

interface Props extends RowProps {
	media: IMedia[];
	showAll?: boolean;
	onDelete?: (id: string) => void;
	onEdit?: (id: string, media: IMedia) => void;
}

export function PostMedia({ media, showAll = false, onDelete, onEdit, ...props }: Props) {
	const dislayMedia = showAll ? media : media?.slice(0, 6);
	const hiddenMedia = showAll ? [] : media?.slice(6);

	return (
		<Row className={styles.post_media} gutter={[8, 8]} align="middle" justify="center" {...props}>
			<Image.PreviewGroup>
				{dislayMedia.map((item, index) => {
					const { _id, link, description } = item;
					const hasMore = !showAll && media?.length > 6 && index === 5;

					return (
						<Col span={getColumnSize(index, media?.length)} key={_id}>
							<Card
								type="inner"
								className={styles.post_media_card}
								cover={
									<div className={styles.post_media_item}>
										<Image
											src={link}
											alt="media"
											className={styles.post_media_item_img}
											preview={{
												mask: !hasMore ? 'Xem ảnh' : ' ',
											}}
										/>

										{/* Has more image */}
										{hasMore && (
											<div className={styles.more_overlay}>
												<Button shape="circle" type="text">
													<span className={styles.more_text}>+ {media?.length - 6}</span>
												</Button>
											</div>
										)}
									</div>
								}
								bodyStyle={{ padding: 0 }}
							>
								{/* Button delete image */}
								{onDelete && (
									<Button
										className={styles.post_media_item_delete}
										onClick={() => onDelete(_id)}
										danger
										shape="circle"
										size="small"
										icon={<HiX />}
									/>
								)}

								{onEdit ? (
									<Input.TextArea
										autoSize={{ minRows: 2, maxRows: 4 }}
										defaultValue={description}
										onBlur={(e) => onEdit(_id, { ...item, description: e.target.value })}
										placeholder="Thêm mô tả"
									/>
								) : (
									description && (
										<Typography.Paragraph
											style={{ margin: 0, width: '100%', padding: 8 }}
											ellipsis={{ rows: 2 }}
										>
											{description}
										</Typography.Paragraph>
									)
								)}
							</Card>
						</Col>
					);
				})}

				{/* Hidden media */}
				{hiddenMedia.map(({ _id, link }) => (
					<Image src={link} key={_id} alt="media" className={styles.post_media_item_hidden} />
				))}
			</Image.PreviewGroup>
		</Row>
	);
}
