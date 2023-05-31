import { InfinitFetcherType } from '@hooks';
import { IData } from '@interfaces';
import { stringUtil } from '@utils/common';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

interface Props<T extends IData> {
	fetcher: InfinitFetcherType<T>;
	scrollThreshold?: number;
	toOption: (item: T) => DefaultOptionType;
}

export function SelectApi<T extends IData = any>({
	fetcher,
	scrollThreshold = 100,
	toOption,
	...props
}: Props<T> & SelectProps<T>) {
	const handeScroll = (e: any) => {
		const isBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) < scrollThreshold;

		const needMore = isBottom && fetcher.hasMore;

		if (needMore && !fetcher.fetching) fetcher.loadMore();
	};

	return (
		<Select
			options={fetcher.data.map(toOption)}
			loading={fetcher.fetching}
			onPopupScroll={handeScroll}
			filterOption={(input, option) => {
				const label = option?.label?.toString() || '';
				return stringUtil.search(label, input, { normalize: true, ignoreCase: true });
			}}
			showSearch
			{...props}
		/>
	);
}
