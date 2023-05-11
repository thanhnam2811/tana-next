import { withAuth } from '@components/Auth';
import { WhiteBox } from '@components/Box';
import { FilterUser, ListUser } from '@components/List';
import { Navigate } from '@components/Tab';
import { useInfiniteFetcher } from '@hooks';
import { CenterArea, ContainerArea, LeftArea } from '@layout';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { HiSparkles, HiUserGroup, HiUserPlus, HiUsers } from 'react-icons/hi2';
import { IconType } from 'react-icons/lib';

export type Relationship = 'friend' | 'sent' | 'received' | 'none';
export type FriendsType = 'friends' | 'requests' | 'suggests' | 'all';

type RelationshipData = { [key in FriendsType]: { label: string; relationship?: Relationship; Icon: IconType } };

const relationshipData: RelationshipData = {
	friends: {
		label: 'Bạn bè',
		relationship: 'friend',
		Icon: HiUsers,
	},
	requests: {
		label: 'Lời mời kết bạn',
		relationship: 'received',
		Icon: HiUserPlus,
	},
	suggests: {
		label: 'Gợi ý',
		relationship: 'none',
		Icon: HiSparkles,
	},
	all: {
		label: 'Tất cả',
		Icon: HiUserGroup,
	},
};

function Friends() {
	const router = useRouter();
	const type = (router.query.type as FriendsType) || 'friends';

	const relationship = relationshipData[type]?.relationship;
	const userFetcher = useInfiniteFetcher(`/users/searchUser/${type}`);
	const [userPreview, setUserPreview] = useState<any>(null);

	const changeType = (type: FriendsType) => {
		router.push({ pathname: router.pathname, query: { type } });
	};
	const previewUser = (user: any) => setUserPreview(user);

	return (
		<ContainerArea>
			<LeftArea fixed>
				<WhiteBox>
					<Navigate.Tabs
						value={type ?? false}
						onChange={(_, type) => changeType(type)}
						orientation="vertical"
						sx={{
							'& svg.MuiTab-iconWrapper': {
								mb: 0,
								width: 24,
								height: 24,
								mr: 1,
							},
						}}
					>
						{Object.entries(relationshipData).map(([key, { label, Icon }]) => (
							<Navigate.Tab key={key} value={key} label={label} icon={<Icon />} />
						))}
					</Navigate.Tabs>
				</WhiteBox>
			</LeftArea>
			{/* Summary */}
			<CenterArea>
				<WhiteBox p={2}>
					<FilterUser fetcher={userFetcher} />

					<ListUser type={type} onUserClick={previewUser} fetcher={userFetcher} relationship={relationship} />
				</WhiteBox>
			</CenterArea>
		</ContainerArea>
	);
}

export default withAuth(Friends);
