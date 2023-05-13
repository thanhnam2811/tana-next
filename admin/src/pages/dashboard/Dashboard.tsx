import { IDashboardData, dashboardApi } from '@/api';
import Icon from '@ant-design/icons';
import { Card, Col, Row, Statistic, StatisticProps } from 'antd';
import { useEffect, useState } from 'react';
import { IoPeopleOutline } from 'react-icons/io5';
import { LineChart, PieChart } from './charts';
import { UserTable } from './tables';

function Dashboard() {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<IDashboardData>({
		totalUser: 0,
		numUserOnline: 0,
		numAccessInDay: 0,
		numUserCreateInDay: 0,
	});

	const dashboardCard: StatisticProps[] = [
		{
			title: 'Tổng số người dùng',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data.totalUser, // convert number to string
		},
		{
			title: 'Đang hoạt động',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data.numUserOnline,
		},
		{
			title: 'Truy cập trong ngày',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data.numAccessInDay,
		},
		{
			title: 'Người dùng mới',
			prefix: <Icon component={IoPeopleOutline} style={{ marginRight: 16 }} />,
			value: data.numUserCreateInDay,
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const { data } = await dashboardApi.getData();
				setData(data);
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		};
		fetchData();
	}, []);

	return (
		<Row gutter={[16, 16]}>
			{dashboardCard.map((item, index) => (
				<Col key={index} xs={12} lg={6}>
					<Card loading={loading}>
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

export default Dashboard;
