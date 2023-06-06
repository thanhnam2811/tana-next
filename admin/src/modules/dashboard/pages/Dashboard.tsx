import Icon from '@ant-design/icons';
import { Card, Col, Row, Statistic, StatisticProps } from 'antd';
import { IoPeopleOutline } from 'react-icons/io5';
import { LineChart, PieChart, UserTable } from '../components';
import useSWR from 'swr';
import { IDashboardData } from '../types';
import swrFetcher from '@/api/swrFetcher';

export default function DashboardPage() {
	const { data, isLoading } = useSWR<IDashboardData>('/admin/dashboard', swrFetcher);

	const dashboardCard: StatisticProps[] = [
		{
			title: 'Tổng số người dùng',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.totalUser,
		},
		{
			title: 'Đang hoạt động',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserOnline,
		},
		{
			title: 'Truy cập trong ngày',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numAccessInDay,
		},
		{
			title: 'Người dùng mới',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserCreateInDay,
		},
	];

	return (
		<Row gutter={[16, 16]}>
			{dashboardCard.map((item, index) => (
				<Col key={index} xs={12} lg={6}>
					<Card loading={isLoading}>
						<Statistic {...item} valueStyle={{ fontWeight: 800 }} />
					</Card>
				</Col>
			))}

			<Col xs={24} lg={18}>
				<LineChart />
			</Col>

			<Col xs={24} lg={6}>
				<PieChart />
			</Col>

			<Col xs={24} lg={12}>
				<UserTable />
			</Col>
		</Row>
	);
}
