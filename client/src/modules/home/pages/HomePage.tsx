import { useFetcher } from '@common/hooks';
import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { CreatePost, ListPost } from '@modules/post/components';
import { PostType } from '@modules/post/types';
import { QuickContact, ShortCut } from '../components';

function HomePage() {
	const postFetch = useFetcher<PostType>({ api: 'posts/home' });

	return (
		<>
			<Layout.Sider align="left">
				<ShortCut />
			</Layout.Sider>

			<Layout.Content>
				<CreatePost fetcher={postFetch} style={{ marginBottom: 16 }} />

				<ListPost fetcher={postFetch} />
			</Layout.Content>

			<Layout.Sider align="right">
				<QuickContact />
			</Layout.Sider>
		</>
	);
}

export default withAuth(withLayout(HomePage));
