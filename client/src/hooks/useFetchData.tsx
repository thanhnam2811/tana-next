import { IPaginationResponse } from '@interfaces';
import apiClient, { swrFetcher } from '@utils/api/apiClient';
import queryString from 'query-string';
import { useCallback, useMemo, useState, useEffect } from 'react';
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

// // SWR Version
// import { swrFetcher } from '@utils/api/apiClient';
// import useSWRInfinite from 'swr/infinite';
// import queryString from 'query-string';

// export function useInfiniteFetcher<T extends { _id: string } = any>(api: string): InfinitFetcherType<T> {
// 	const initParams = { size: 20 };
// 	const [params, setParams] = useState<any>(initParams);
// 	const getKey = useCallback(
// 		(pageIndex: number, prevData: PaginationResponse<T>) => {
// 			if (prevData && !prevData.hasNextPage) return null;

// 			params.offset = pageIndex * params.size;
// 			return `${api}?${queryString.stringify(params)}`;
// 		},
// 		[params]
// 	);

// 	const { data, error, size, setsize, mutate } = useSWRInfinite<PaginationResponse<any>>(getKey, swrFetcher);

// 	const items: T[] = data?.reduce((acc: T[], cur) => [...acc, ...cur.items], []) || [];

// 	const fetching = !data && !error;
// 	const hasMore = !!data?.[data.length - 1]?.hasNextPage;

// 	const fetch = (params: any) => {
// 		setParams(params);
// 		setsize(1);
// 	};

// 	const loadMore = () => setsize(size + 1);

// 	const reload = () => {
// 		setParams(initParams); // Reset params
// 		setsize(1);
// 	};

// 	const filter = (filter: any) => {
// 		setParams({ ...params, ...filter });
// 		setsize(1);
// 	};

// 	const addData = (item: T) => {
// 		// Make a shallow copy of the existing data array and add the new data to the beginning
// 		const newItems = [item, ...items];
// 		// Update the cache with the new data
// 		setsize(size + 1);
// 		mutate((prevData) => {
// 			const newPages = prevData?.map((page, index) => {
// 				const startIndex = index * params.size,
// 					endIndex = (index + 1) * params.size;
// 				return {
// 					...page,
// 					items: newItems.slice(startIndex, endIndex),
// 				};
// 			});
// 			return newPages;
// 		});
// 	};

// 	const updateData = (_id: string, newData: T) => {
// 		// Make a shallow copy of the existing data array and add the new data to the beginning
// 		const newItems = items.map((item) => (item._id === _id ? { ...item, ...newData } : item));
// 		// Update the cache with the new data
// 		mutate((prevData) => {
// 			const newPages = prevData?.map((page, index) => {
// 				const startIndex = index * params.size,
// 					endIndex = (index + 1) * params.size;
// 				return {
// 					...page,
// 					items: newItems.slice(startIndex, endIndex),
// 				};
// 			});
// 			return newPages;
// 		});
// 	};

// 	const removeData = (_id: string) => {
// 		// Make a shallow copy of the existing data array and add the new data to the beginning
// 		const newItems = items.filter((item) => item._id !== _id);
// 		// Update the cache with the new data
// 		mutate((prevData) => {
// 			const newPages = prevData?.map((page, index) => {
// 				const startIndex = index * params.size,
// 					endIndex = (index + 1) * params.size;
// 				return {
// 					...page,
// 					items: newItems.slice(startIndex, endIndex),
// 				};
// 			});
// 			return newPages;
// 		});
// 	};

// 	return {
// 		data: items,
// 		params,
// 		fetching,
// 		hasMore,
// 		fetch,
// 		loadMore,
// 		filter,
// 		reload,
// 		addData,
// 		updateData,
// 		removeData,
// 	};
// }

export type InfinitFetcherType<T extends { _id: string } = any> = {
	data: T[];
	updateData: (id: string, newData: T) => void;
	addData: (newData: T) => void;
	removeData: (id: string) => void;
	fetching: boolean;
	validating: boolean;
	hasMore: boolean;
	params: any;
	fetch: (params: any) => void;
	loadMore: () => void;
	filter: (filter: any) => void;
	reload: () => void;
	api: string;
};

import useSWR from 'swr';

interface useInfiniteFetcherSWROptions {
	params?: object;
}

export const useInfiniteFetcherSWR = <T extends { _id: string } = any>(
	api: string,
	{ params: initParams }: useInfiniteFetcherSWROptions = {}
): InfinitFetcherType<T> => {
	const [data, setData] = useState<T[]>([]);
	console.log('data', data);

	const [params, setParams] = useState({ offset: 0, size: 20, ...initParams });

	const {
		data: res,
		isLoading: fetching,
		isValidating: validating,
		mutate: reloadSWR,
	} = useSWR<IPaginationResponse<T>>(`${api}?${queryString.stringify(params)}`, swrFetcher);

	useEffect(() => {
		console.log('useInfiniteFetcherSWR', res);

		if (!res) return;

		if (res.offset == 0) {
			setData(res.items || []);
		} else {
			const items = res.items || [];
			const offset = res.offset || 0;
			setData((prev) => prev.splice(offset, items.length, ...items));
		}
	}, [res]);

	const hasMore = res ? res.totalItems > params.offset + params.size : true; // If res is null, hasMore is true (prevent stop fetching when error)

	const addData = (newData: T) => {
		setData((prev) => [newData, ...prev]);
	};

	const updateData = (id: string, newData: T) => {
		setData((prev) => prev.map((item) => (item._id === id ? newData : item)));
	};

	const removeData = (id: string) => {
		setData((prev) => prev.filter((item) => item._id !== id));
	};

	const fetch = (params: object) => {
		setParams((prev) => ({ ...prev, ...params, offset: 0 }));
	};

	const loadMore = () => {
		setParams((prev) => ({ ...prev, offset: data.length }));
	};

	const reload = () => {
		setParams({ ...params, offset: 0 });
		reloadSWR();
	};

	const filter = (filter: object) => {
		setParams((prev) => ({ ...prev, ...filter, offset: 0 }));
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
		[data, params, fetching, hasMore, fetch, loadMore, filter, reload, addData, updateData, removeData, api]
	);

	return fetcher;
};
