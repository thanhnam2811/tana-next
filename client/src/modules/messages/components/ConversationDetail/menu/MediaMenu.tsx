import React from 'react';
import { useConversationContext } from '@modules/messages/hooks';
import { useFetcher } from '@common/hooks';
import { IFile } from '@common/types';
import { Button, Image, List } from 'antd';
import { fileUtil } from '@common/utils';

export function MediaMenu() {
	const { conversation } = useConversationContext();
	const mediaFetcher = useFetcher<IFile>({ api: `conversations/${conversation._id}/files/media` });

	return (
		<Image.PreviewGroup>
			<List
				dataSource={mediaFetcher.data}
				renderItem={(file) => (
					<List.Item>
						<List.Item.Meta
							avatar={<Image src={file.link} alt={file.originalname} />}
							title={file.originalname}
							description={fileUtil.formatSize(file.size)}
						/>
					</List.Item>
				)}
				loading={mediaFetcher.fetching}
				loadMore={
					!mediaFetcher.fetching &&
					mediaFetcher.hasMore && <Button onClick={mediaFetcher.loadMore}>Xem thêm</Button>
				}
			/>
		</Image.PreviewGroup>
	);
}
