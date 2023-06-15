import { FetcherType } from '@common/hooks';
import { IData } from '@common/types';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { stringUtil } from '@common/utils';
import { ReactNode } from 'react';

interface Props<T extends IData> {
	fetcher: FetcherType<T>;
	scrollThreshold?: number;
	toOption: (item: T) => DefaultOptionType;
	renderOption?: (item: T) => ReactNode;
}

export function SelectApi<T extends IData = any>({
	fetcher,
	scrollThreshold = 100,
	toOption,
	renderOption,
	...props
}: Props<T> & SelectProps<T>) {
	const handeScroll = (e: any) => {
		const isBottom = e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight) < scrollThreshold;

		const needMore = isBottom && fetcher.hasMore;

		if (needMore && !fetcher.fetching) fetcher.loadMore();
	};

	return (
		<Select
			options={!renderOption ? fetcher.data.map(toOption) : undefined} // if renderOption is defined, options will be rendered by renderOption
			loading={fetcher.fetching}
			onPopupScroll={handeScroll}
			filterOption={(input, option) => {
				const label = option?.label?.toString() || '';
				return stringUtil.search(label, input, { normalize: true, ignoreCase: true });
			}}
			showSearch
			{...props}
		>
			{renderOption &&
				fetcher.data.map((item) => <Select.Option key={item._id}>{renderOption(item)}</Select.Option>)}
		</Select>
	);
}
