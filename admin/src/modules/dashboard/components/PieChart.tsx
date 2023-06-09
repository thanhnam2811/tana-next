import { Pie, PieConfig } from '@ant-design/plots';
import { Card } from 'antd';
import { IStatisticData } from '../types';
import useSWR from 'swr';
import { useState } from 'react';
import { swrFetcher } from '@common/api';

export function PieChart() {
	const [by] = useState('gender');
	const { data } = useSWR<IStatisticData[]>(`/admin/statictisUser?by=${by}`, swrFetcher);

	const config: PieConfig = {
		appendPadding: 10,
		data: data || [],
		angleField: 'total',
		colorField: '_id',
		radius: 0.9,
		label: {
			type: 'inner',
			offset: '-30%',
			content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
			style: {
				fontSize: 14,
				textAlign: 'center',
			},
			formatter: (datum) => `${datum._id}: ${datum.total}`,
		},
		interactions: [
			{
				type: 'element-active',
			},
		],
		legend: {
			layout: 'horizontal',
			position: 'bottom',
			flipPage: false,
		},
	};
	return (
		<Card title="Thống kê người dùng">
			<Pie {...config} />
		</Card>
	);
}
