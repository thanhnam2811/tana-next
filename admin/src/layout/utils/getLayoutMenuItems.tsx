import { layoutData } from '@layout/data';
import { MenuProps } from 'antd';

export function getLayoutMenuItems(data = layoutData) {
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
