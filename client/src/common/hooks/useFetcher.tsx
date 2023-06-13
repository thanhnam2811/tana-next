import { swrFetcher } from '@common/api';
import { IData, IPaginationParams, IPaginationResponse } from '@common/types';
import { useCallback, useMemo } from 'react';
import useSWRInfinite from 'swr/infinite';
import { urlUtil } from '@common/utils';

// T: Data type,
export type FetcherType<T extends IData> = {
	data: T[];
	updateData: (id: string, newData: T) => void;
	addData: (newData: T) => void;
	removeData: (id: string) => void;
	fetching: boolean;
	validating: boolean;
	hasMore: boolean;
	params: IPaginationParams;
	fetch: (params: any) => void;
	loadMore: () => void;
	filter: (filter: any) => void;
	reload: () => void;
	api: string;
};

export interface FetcherProps {
	api: string;
	limit?: number;
	params?: IPaginationParams;
}

export const useFetcher = <T extends IData = any>({ api, limit = 20, params = {} }: FetcherProps): FetcherType<T> => {
	const getKey = useCallback(
		(pageIndex: number, prevData: IPaginationResponse<T>) => {
			if (pageIndex === 0) return urlUtil.generateUrl(api, { ...params, size: limit });

			const prevOffset = Number(prevData?.offset) || 0;
			const prevItems = prevData?.items || [];
			if (prevOffset + prevItems.length >= prevData.totalItems) return null; // No more data

			const offset = prevOffset + prevItems.length;
			return urlUtil.generateUrl(api, { ...params, offset, size: limit });
		},
		[limit, api, params]
	);

	const {
		data: listRes,
		isLoading: fetching,
		isValidating: validating,
		mutate,
		size: page,
		setSize: setPage,
	} = useSWRInfinite<IPaginationResponse<T>>(getKey, swrFetcher);

	const { data, hasMore } = useMemo(() => {
		const memo = { data: [], hasMore: true };

		if (!listRes?.length) return memo;

		const lastPage = listRes[listRes.length - 1];
		const data = listRes.reduce<T[]>((acc, res) => [...acc, ...res.items], []);
		const hasMore = lastPage.totalItems > data.length;

		return { data, hasMore };
	}, [listRes]);

	const addData = (newData: T) => {
		// Make a shallow copy of the existing data array and add the new data to the beginning
		const newItems = [newData, ...data];

		// Update the cache with the new data (don't mutate the existing cache)
		mutate((prevData) => {
			const newPages = prevData?.map((page, index) => {
				const startIndex = index * limit,
					endIndex = (index + 1) * limit;
				return {
					...page,
					items: newItems.slice(startIndex, endIndex),
					totalItems: page.totalItems + 1,
				};
			});
			return newPages;
		}, false); // Optimistically update the data to add the new item to the beginning of the list
	};

	const updateData = (id: string, newData: T) => {
		// Update the cache with the new data
		mutate((prevData) => {
			let updated = false;
			const newPages = prevData?.map((page) => {
				if (updated) return page;

				return {
					...page,
					items: page.items.map((item) => {
						if (item._id === id) {
							updated = true;
							console.log({ item, newData });
							return newData;
						}
						return item;
					}),
				};
			});
			return newPages;
		}, false); // Optimistically update the data to add the new item to the beginning of the list
	};

	const removeData = (id: string) => {
		// Make a shallow copy of the existing data array and add the new data to the beginning
		const newItems = data.filter((item) => item._id !== id);

		// Update the cache with the new data
		mutate((prevData) => {
			const newPages = prevData?.map((page, index) => {
				const startIndex = index * limit,
					endIndex = (index + 1) * limit;
				return {
					...page,
					items: newItems.slice(startIndex, endIndex),
					totalItems: page.totalItems - 1,
				};
			});
			return newPages;
		}, false); // Optimistically update the data to add the new item to the beginning of the list
	};

	const fetch = (params: object) => {
		console.log({ params });
	};

	const loadMore = () => {
		console.log('loadMore');

		setPage(page + 1);
	};

	const reload = () => {
		mutate();
	};

	const filter = (filter: object) => {
		console.log({ filter });
	};

	const fetcher = useMemo(
		() => ({
			data,
			params,
			fetching,
			validating,
			hasMore,
			fetch,
			loadMore,
			filter,
			reload,
			addData,
			updateData,
			removeData,
			api,
		}),
		[data, fetching, hasMore, fetch, loadMore, filter, reload, addData, updateData, removeData, api]
	);

	return fetcher;
};
