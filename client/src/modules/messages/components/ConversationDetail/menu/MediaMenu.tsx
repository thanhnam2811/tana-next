import React from 'react';
import { useConversationContext } from '@modules/messages/hooks';
import { useFetcher } from '@common/hooks';
import { IFile } from '@common/types';
import { Button, Image, List } from 'antd';
import { fileUtil } from '@common/utils';
import styles from '../ConversationDetail.module.scss';
import { HiEye } from 'react-icons/hi2';
import { HiDownload } from 'react-icons/hi';
import Link from 'next/link';

export function MediaMenu() {
	const { conversation } = useConversationContext();
	const mediaFetcher = useFetcher<IFile>({ api: `conversations/${conversation._id}/files/media` });

	return (
		<Image.PreviewGroup>
			<List
				dataSource={mediaFetcher.data}
				renderItem={(file) => {
					const fileName = file.name || file.link.split('/').pop();
					const isVideo = !!(fileName && fileUtil.isVideo(fileName));

					return (
						<List.Item
							className={styles.file_item}
							extra={
								<Link href={file.link} target="_blank" download>
									<Button shape="circle" key="download" icon={<HiDownload />} size="small" />
								</Link>
							}
						>
							<List.Item.Meta
								avatar={
									isVideo ? (
										<video src={file.link} className={styles.file_icon} controls />
									) : (
										<Image
											src={file.link}
											alt={file.originalname}
											className={styles.file_icon}
											preview={{
												maskClassName: styles.file_icon,
												mask: <HiEye />,
											}}
										/>
									)
								}
								title={file.originalname}
								description={fileUtil.formatSize(file.size)}
							/>
						</List.Item>
					);
				}}
				loading={mediaFetcher.fetching}
				loadMore={
					!mediaFetcher.fetching &&
					mediaFetcher.hasMore && <Button onClick={mediaFetcher.loadMore}>Xem thêm</Button>
				}
			/>
		</Image.PreviewGroup>
	);
}
