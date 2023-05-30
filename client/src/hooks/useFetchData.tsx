import { IPaginationResponse } from '@interfaces';
import apiClient, { swrFetcher } from '@utils/api/apiClient';
import { stringUtil } from '@utils/common';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

interface PaginationResponse<T extends { _id: string } = any> {
	items: T[];
	totalItems: number;
	hasNextPage: boolean;
}

export function useInfiniteFetcher<T extends { _id: string } = any>(api: string): InfinitFetcherType<T> {
	const [fetching, setFetching] = useState(false);
	const [data, setData] = useState<T[]>([]);

	const [hasMore, setHasMore] = useState(true);
	const [params, setParams] = useState<any>({
		offset: 0,
		size: 20,
	});

	const fetch = useCallback(
		async (params: any) => {
			setFetching(true);

			try {
				const res: { data: PaginationResponse } = await apiClient.get(api, { params });
				const { totalItems, items } = res.data;
				setData((prev) => [...prev, ...items]);
				setHasMore(totalItems > params.offset + params.size);
				setParams(params);
			} catch (error: any) {
				toast.error(error.toString());
			}

			setFetching(false);
		},
		[api]
	);

	const loadMore = useCallback(() => fetch({ ...params, offset: data.length }), [data.length, fetch, params]);

	const reload = useCallback(() => {
		setData([]);
		setHasMore(true);
		return fetch({ ...params, offset: 0 });
	}, [fetch, params]);

	const filter = useCallback(
		(filter: any) => {
			setData([]);
			return fetch({ ...params, ...filter, offset: 0 });
		},
		[fetch, params]
	);

	const updateData = useCallback(
		(id: string, newData: any) =>
			setData((prev) => prev.map((item) => (item._id === id ? { ...item, ...newData } : item))),
		[]
	);

	const addData = useCallback((newData: any) => setData((prev) => [newData, ...prev]), []);

	const removeData = useCallback((id: string) => setData((prev) => prev.filter((item) => item._id !== id)), []);

	const fetcher = useMemo(
		() => ({
			api,
			data,
			updateData,
			addData,
			removeData,
			fetching,
			hasMore,
			params,
			fetch,
			loadMore,
			filter,
			reload,
			validating: false,
		}),
		[api, data, updateData, addData, removeData, fetching, hasMore, params, fetch, loadMore, filter, reload]
	);

	return fetcher;
}

export type InfinitFetcherType<T extends { _id: string } = any> = {
	data: T[];
	updateData: (id: string, newData: T) => void;
	addData: (newData: T) => void;
	removeData: (id: string) => void;
	fetching: boolean;
	validating: boolean;
	hasMore: boolean;
	params: object;
	fetch: (params: any) => void;
	loadMore: () => void;
	filter: (filter: any) => void;
	reload: () => void;
	api: string;
};

import useSWRInfinite from 'swr/infinite';

interface useInfiniteFetcherSWROptions {
	api: string;
	size?: number;
	params?: object;
}

export const useInfiniteFetcherSWR = <T extends { _id: string } = any>({
	api,
	size = 20,
	params = {},
}: useInfiniteFetcherSWROptions): InfinitFetcherType<T> => {
	const getKey = useCallback(
		(pageIndex: number, prevData: IPaginationResponse<T>) => {
			if (pageIndex === 0) return stringUtil.generateUrl(api, { ...params, size });

			const prevOffset = Number(prevData?.offset) || 0;
			const prevItems = prevData?.items || [];
			if (prevOffset + prevItems.length >= prevData.totalItems) return null; // No more data

			const offset = prevOffset + prevItems.length;
			return stringUtil.generateUrl(api, { ...params, offset, size });
		},
		[size, api, params]
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

		// Update the cache with the new data
		mutate((prevData) => {
			const newPages = prevData?.map((page, index) => {
				const startIndex = index * size,
					endIndex = (index + 1) * size;
				return {
					...page,
					items: newItems.slice(startIndex, endIndex),
				};
			});
			return newPages;
		});
	};

	const updateData = (id: string, newData: T) => {
		// Make a shallow copy of the existing data array and add the new data to the beginning
		const newItems = data.map((item) => (item._id === id ? { ...item, ...newData } : item));

		// Update the cache with the new data
		mutate((prevData) => {
			const newPages = prevData?.map((page, index) => {
				const startIndex = index * size,
					endIndex = (index + 1) * size;
				return {
					...page,
					items: newItems.slice(startIndex, endIndex),
				};
			});
			return newPages;
		});
	};

	const removeData = (id: string) => {
		// Make a shallow copy of the existing data array and add the new data to the beginning
		const newItems = data.filter((item) => item._id !== id);

		// Update the cache with the new data
		mutate((prevData) => {
			const newPages = prevData?.map((page, index) => {
				const startIndex = index * size,
					endIndex = (index + 1) * size;
				return {
					...page,
					items: newItems.slice(startIndex, endIndex),
				};
			});
			return newPages;
		});
	};

	const fetch = (params: object) => {
		console.log({ params });
	};

	const loadMore = () => {
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
