import { withAuth } from '@components/Auth';
import { QuickContact, ShortCut } from '@components/Home';
import { CreatePost, ListPost } from '@components/v2/List/ListPost';
import { useInfiniteFetcher } from '@hooks';
import { IPost } from '@interfaces';
import { CenterArea, ContainerArea, LeftArea, RightArea } from '@layout/Area';
import { withLayout } from '@layout/v2';

function Home() {
	const postFetch = useInfiniteFetcher<IPost>('posts/home');

	return (
		<ContainerArea>
			<LeftArea fixed>
				<ShortCut />
			</LeftArea>

			<CenterArea>
				<CreatePost fetcher={postFetch} style={{ marginBottom: 16 }} />

				<ListPost fetcher={postFetch} />
			</CenterArea>

			<RightArea fixed>
				<QuickContact />
			</RightArea>
		</ContainerArea>
	);
}

export default withAuth(withLayout(Home));
