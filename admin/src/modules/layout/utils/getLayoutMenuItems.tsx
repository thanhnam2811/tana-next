import { MenuProps } from 'antd';
import layoutData from '../data/layoutData';

export default function getLayoutMenuItems(data = layoutData) {
	const items: MenuProps['items'] = [];

	for (const item of data) {
		items.push({
			key: item.path,
			icon: item.icon,
			label: item.title,
			children: item.children && getLayoutMenuItems(item.children),
		});
	}

	return items;
}
