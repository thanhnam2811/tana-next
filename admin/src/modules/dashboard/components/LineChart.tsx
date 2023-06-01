import { Line, LineConfig } from '@ant-design/plots';
import { Typography } from 'antd';
import { DatePickerProps } from 'antd';
import { Card, DatePicker, Select, Space } from 'antd';
import { useEffect, useState } from 'react';

export default function LineChart() {
	const [type, setType] = useState<DatePickerProps['picker']>('date');
	const [data, setData] = useState([]);

	useEffect(() => {
		asyncFetch();
	}, []);

	const asyncFetch = () => {
		fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
			.then((response) => response.json())
			.then((json) => setData(json))
			.catch((error) => {
				console.log('fetch data failed', error);
			});
	};

	const config: LineConfig = {
		data,
		padding: 'auto',
		xField: 'Date',
		yField: 'scales',
		xAxis: {
			// type: 'timeCat',
			tickCount: 5,
		},
		smooth: true,
	};

	return (
		<Card
			title="Line chart"
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

					<DatePicker picker={type} onChange={console.log} />
				</Space>
			}
		>
			<Line {...config} />;
		</Card>
	);
}
