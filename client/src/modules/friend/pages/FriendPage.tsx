import Layout, { withLayout } from '@layout/components';
import { withAuth } from '@modules/auth/components';
import { Card, Menu } from 'antd';
import { useRouter } from 'next/router';
import { ListFriend } from '../components';
import { friendTypeList } from '../data';
import { FriendType } from '../types';
import SEO from '@common/components/SEO';

function FriendPage() {
	const router = useRouter();
	const type = (router.query.type as FriendType) || 'friends';
	const title = friendTypeList.find((item) => item.type === type)?.title;

	const changeType = (type: FriendType) => router.push({ pathname: router.pathname, query: { type } });

	return (
		<>
			<SEO title={title} />

			<Layout.Sider align="left">
				<Card title="Danh sách" headStyle={{ padding: '0 16px' }} bodyStyle={{ padding: 8 }}>
					<Menu
						mode="vertical"
						style={{ width: '100%', border: 'none' }}
						items={friendTypeList.map((item) => ({
							key: item.type,
							icon: <item.Icon size={20} />,
							label: item.title,
						}))}
						selectedKeys={[type]}
						onClick={({ key }) => changeType(key as FriendType)}
					/>
				</Card>
			</Layout.Sider>

			<Layout.Content>
				<ListFriend title={title} api={`users/searchUser/${type}`} />
			</Layout.Content>
		</>
	);
}

export default withAuth(withLayout(FriendPage));
