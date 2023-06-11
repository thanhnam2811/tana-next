import { useFetcher, FetcherProps } from '@common/hooks';
import { IData } from '@common/types';
import { stringUtil } from '@utils/common';
import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

interface Props<T extends IData> {
	scrollThreshold?: number;
	toOption: (item: T) => DefaultOptionType;
	renderOption?: (item: T) => React.ReactNode;
}

export function SelectApi<T extends IData = any>({
	scrollThreshold = 100,
	toOption,
	renderOption,
	api,
	params,
	limit,
	...props
}: Props<T> & SelectProps<T> & FetcherProps) {
	const fetcher = useFetcher<T>({ api, params, limit });

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
