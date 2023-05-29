import { DraftViewer } from '@components/Editor';
import { IPost } from '@interfaces';
import { useEffect, useRef, useState } from 'react';
import { IMedia } from '@interfaces/common';
import styles from './PostCard.module.scss';
import { Typography } from 'antd';

const LINE_HEIGHT = 24; // Height of each line of post content
const MAX_HEIGHT = 5 * LINE_HEIGHT; // Max height of post content

interface Props {
	post: IPost & { media: IMedia[] };
}

export function PostContent({ post }: Props) {
	const postContentRef = useRef<HTMLDivElement>(null);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		setTimeout(() => {
			const postContentEl = postContentRef?.current;
			if (!postContentEl) return;

			const { clientHeight, scrollHeight } = postContentEl;
			if (clientHeight && scrollHeight) {
				setHasMore(scrollHeight > clientHeight);
			}
		}, 0); // Delay to get clientHeight and scrollHeight
	}, []);

	const handleShowMoreContent = () => {
		const postContentEl = postContentRef?.current;

		if (!postContentEl) return;

		postContentEl.style.maxHeight = `${postContentEl.scrollHeight}px`;
		setHasMore(false);
	};

	return (
		<div style={{ maxHeight: MAX_HEIGHT }} ref={postContentRef} className={styles.post_content}>
			<DraftViewer content={post.content} />

			{/* Button read more */}
			{hasMore && (
				<div className={styles.more_container}>
					<Typography.Link className={styles.more} onClick={handleShowMoreContent}>
						...Xem thêm
					</Typography.Link>
				</div>
			)}
		</div>
	);
}
