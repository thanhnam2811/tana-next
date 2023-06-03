import { QuickContact, ShortCut } from '@components/Home';
import { useInfiniteFetcherSWR } from '@hooks';
import Layout, { withLayout } from '@layout';
import { withAuth } from '@modules/auth/components';
import { CreatePost, ListPost } from '@modules/post/components';
import { PostType } from '@modules/post/types';

function Home() {
	const postFetch = useInfiniteFetcherSWR<PostType>({ api: 'posts/home' });

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

export default withAuth(withLayout(Home));
