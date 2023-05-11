import { withAuth } from '@components/Auth';
import { QuickContact, ShortCut } from '@components/Home';
import { CreatePost, ListPost } from '@components/List/ListPost';
import { useInfiniteFetcher } from '@hooks';
import { CenterArea, ContainerArea, LeftArea, RightArea } from '@layout';

function Home() {
	const postFetch = useInfiniteFetcher('posts/home');

	return (
		<ContainerArea>
			<LeftArea fixed>
				<ShortCut />
			</LeftArea>

			<CenterArea>
				<CreatePost fetcher={postFetch} />

				<ListPost fetcher={postFetch} />
			</CenterArea>

			<RightArea fixed>
				<QuickContact />
			</RightArea>
		</ContainerArea>
	);
}

export default withAuth(Home);
