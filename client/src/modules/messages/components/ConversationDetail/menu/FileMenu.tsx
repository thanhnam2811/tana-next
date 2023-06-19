import React from 'react';
import { useConversationContext } from '@modules/messages/hooks';
import { useFetcher } from '@common/hooks';
import { IFile } from '@common/types';
import { Button, Image, List } from 'antd';
import { fileUtil } from '@common/utils';

export function FileMenu() {
	const { conversation } = useConversationContext();
	const fileFetcher = useFetcher<IFile>({ api: `conversations/${conversation._id}/files/other` });

	return (
		<List
			dataSource={fileFetcher.data}
			renderItem={(file) => (
				<List.Item>
					<List.Item.Meta
						avatar={<Image src={fileUtil.getFilePreview(file)} alt={file.originalname} />}
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
