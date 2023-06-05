import { layoutData } from '@layout/data';
import { ILayoutData } from '@layout/types';
import { BreadcrumbProps } from 'antd';
import { Link } from 'react-router-dom';

const findLayoutItem = (path: string, parentChildren?: ILayoutData[]): ILayoutData | null => {
	const item = parentChildren?.find((item) => item.path === path);

	return item || null;
};

export function getBreadcrumbItems(pathname: string) {
	const items: BreadcrumbProps['items'] = [];

	const layoutItems: ILayoutData[] = [];
	const paths = pathname.split('/').filter((path) => path);
	const length = paths.length;

	for (let i = 0; i < length; i++) {
		const path = paths[i];
		const parent = i === 0 ? layoutData : layoutItems[i - 1].children;
		const layoutItem = findLayoutItem(path, parent);
		if (!layoutItem) continue;

		const isLast = i === length - 1;
		const breadcrumbPath = '/' + paths.slice(0, i + 1).join('/');
		const breadcrumbItem = {
			key: breadcrumbPath,
			title: isLast ? (
				<>
					{layoutItem.icon} {layoutItem.title}
				</>
			) : (
				<Link to={breadcrumbPath}>
					{layoutItem.icon} {layoutItem.title}
				</Link>
			),
		};

		layoutItems.push(layoutItem);
		items.push(breadcrumbItem);
	}

	// Add dashboard breadcrumb item (Always at first position)
	if (!paths.includes('dashboard')) {
		const dashboardItem = layoutData[0];
		items.unshift({
			key: dashboardItem.path,
			title: (
				<Link to={dashboardItem.path}>
					{dashboardItem.icon} {dashboardItem.title}
				</Link>
			),
		});
	}

	return items;
}
