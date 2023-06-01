import { IDashboardData, dashboardApi, swrFetcher } from '@/api';
import Icon from '@ant-design/icons';
import { Card, Col, Row, Statistic, StatisticProps } from 'antd';
import { IoPeopleOutline } from 'react-icons/io5';
import useSWR from 'swr';
import { LineChart, PieChart } from './charts';
import { UserTable } from './tables';

export function Dashboard() {
	const { data, isLoading } = useSWR<IDashboardData>(dashboardApi.endpoint.getData, swrFetcher);

	const dashboardCard: StatisticProps[] = [
		{
			title: 'Tổng số người dùng',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.totalUser || 0,
		},
		{
			title: 'Đang hoạt động',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserOnline || 0,
		},
		{
			title: 'Truy cập trong ngày',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numAccessInDay || 0,
		},
		{
			title: 'Người dùng mới',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data?.numUserCreateInDay || 0,
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
