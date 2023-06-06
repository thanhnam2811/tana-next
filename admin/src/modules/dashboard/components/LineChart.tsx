import swrFetcher from '@/api/swrFetcher';
import { Line, LineConfig } from '@ant-design/plots';
import { Card, DatePicker, DatePickerProps, Select, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import useSWR from 'swr';
import { IUserAccessData } from '../types';

export function LineChart() {
	const [type, setType] = useState<DatePickerProps['picker']>('date');

	const lastWeek = dayjs().subtract(1, 'week').toDate();
	const today = dayjs().toDate();
	const [range, setRange] = useState<[Date, Date]>([lastWeek, today]);

	const { data, isLoading } = useSWR<IUserAccessData>(
		`/admin/usersAccess?start=2023-05-01&end=2023-05-31&type`,
		swrFetcher
	);

	const convertData = (data?: IUserAccessData): { time: string; name: string; total: number }[] => {
		const result: { time: string; name: string; total: number }[] = [];
		if (!data) return result;

		for (const key in data) {
			result.push({
				time: key,
				name: 'Lượt truy cập',
				total: data[key].totalAccess,
			});

			result.push({
				time: key,
				name: 'Người dùng mới',
				total: data[key].totalUserCreations,
			});
		}
		return result;
	};

	const config: LineConfig = {
		data: convertData(data),
		padding: 'auto',
		yField: 'total',
		xField: 'time',
		xAxis: {
			label: {
				formatter: (v) => dayjs(v).format('DD/MM/YYYY'),
			},
		},
		seriesField: 'name',
		legend: {
			position: 'top',
		},
		smooth: true,
		animation: {
			appear: {
				animation: 'path-in',
				duration: 5000,
			},
		},
	};

	return (
		<Card
			title="Lượt truy cập và người dùng mới"
			extra={
				<Space>
					<Typography.Title level={5} style={{ margin: 0 }}>
						Lọc:
					</Typography.Title>

					<Select value={type} onChange={setType}>
						<Select.Option value="date">Ngày</Select.Option>
						<Select.Option value="week">Tuần</Select.Option>
						<Select.Option value="month">Tháng</Select.Option>
						<Select.Option value="quarter">Quý</Select.Option>
						<Select.Option value="year">Năm</Select.Option>
					</Select>

					<DatePicker
						picker={type}
						onChange={(date, dateString) => {
							console.log(date, dateString);
						}}
					/>

					<DatePicker
						picker={type}
						onChange={(date, dateString) => {
							console.log(date, dateString);
						}}
					/>
				</Space>
			}
		>
			<Line {...config} />;
		</Card>
	);
}
