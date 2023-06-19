import React from 'react';
import { useConversationContext } from '@modules/messages/hooks';
import { useFetcher } from '@common/hooks';
import { IFile } from '@common/types';
import { Button, Image, List } from 'antd';
import { fileUtil } from '@common/utils';
import styles from '../ConversationDetail.module.scss';
import Link from 'next/link';
import { HiDownload } from 'react-icons/hi';

export function FileMenu() {
	const { conversation } = useConversationContext();
	const fileFetcher = useFetcher<IFile>({ api: `conversations/${conversation._id}/files/other` });

	return (
		<List
			dataSource={fileFetcher.data}
			renderItem={(file) => (
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
							<Image
								src={fileUtil.getFilePreview(file)}
								alt={file.originalname}
								className={styles.file_icon}
								preview={false}
							/>
						}
						title={file.originalname}
						description={fileUtil.formatSize(file.size)}
					/>
				</List.Item>
			)}
			loading={fileFetcher.fetching}
			loadMore={
				!fileFetcher.fetching && fileFetcher.hasMore && <Button onClick={fileFetcher.loadMore}>Xem thêm</Button>
			}
		/>
	);
}
