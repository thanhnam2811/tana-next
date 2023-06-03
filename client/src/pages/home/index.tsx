import { withAuth } from '@modules/auth/components';
import { QuickContact, ShortCut } from '@components/Home';
import { useInfiniteFetcherSWR } from '@hooks';
import { Content, Sider, withLayout } from '@layout/v2';
import { Layout } from 'antd';
import { PostType } from '@modules/post/types';
import { CreatePost, ListPost } from '@modules/post/components';

function Home() {
	const postFetch = useInfiniteFetcherSWR<PostType>({ api: 'posts/home' });

	return (
		<Layout hasSider>
			<Sider fixed align="left">
				<ShortCut />
			</Sider>

			<Content>
				<CreatePost fetcher={postFetch} style={{ marginBottom: 16 }} />

				<ListPost fetcher={postFetch} />
			</Content>

			<Sider fixed align="right">
				<QuickContact />
			</Sider>
		</Layout>
	);
}

export default withAuth(withLayout(Home));
