import { Pie, PieConfig } from '@ant-design/plots';
import { Card } from 'antd';

export default function PieChart() {
	const data = [
		{
			type: 'Dữ liệu 1',
			value: 100,
		},
		{
			type: 'Dữ liệu 2',
			value: 200,
		},
		{
			type: 'Dữ liệu 3',
			value: 300,
		},
		{
			type: 'Dữ liệu 4',
			value: 100,
		},
		{
			type: 'Dữ liệu 5',
			value: 100,
		},
		{
			type: 'Dữ liệu 6',
			value: 200,
		},
	];
	const config: PieConfig = {
		appendPadding: 10,
		data,
		angleField: 'value',
		colorField: 'type',
		radius: 0.9,
		label: {
			type: 'inner',
			offset: '-30%',
			content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
			style: {
				fontSize: 14,
				textAlign: 'center',
			},
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
		<Card title="Pie chart">
			<Pie {...config} />
		</Card>
	);
}
