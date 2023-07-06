import { swrFetcher } from '@common/api';
import { IData, IPaginationParams, IPaginationResponse } from '@common/types';
import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { urlUtil } from '@common/utils';
import useSWR, { KeyedMutator, useSWRConfig } from 'swr';

// T: Data type,
export type FetcherType<T extends IData, U extends IPaginationResponse<T> = IPaginationResponse<T>> = {
	data: T[];
	listRes?: U[];
	updateData: (id: string, newData: T) => void;
	addData: (newData: T, validate?: boolean) => void;
	removeData: (id: string) => void;
	fetching: boolean;
	loadingMore: boolean;
	validating: boolean;
	hasMore: boolean;
	params: IPaginationParams;
	loadMore: () => void;
	api: string;
	mutate: KeyedMutator<U[]>;
};

export interface FetcherProps {
	api: string;
	limit?: number;
	params?: IPaginationParams;
}

export const useFetcher = <T extends IData = any, U extends IPaginationResponse<T> = IPaginationResponse<T>>({
	api,
	limit = 20,
	params = {},
}: FetcherProps): FetcherType<T, U> => {
	const getKey = useCallback(
		(pageIndex: number, prevData: U) => {
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
	} = useSWRInfinite<U>(getKey, swrFetcher);
	const lastRes = listRes?.[listRes.length - 1];
	const hasMore = !!lastRes && page < lastRes.totalPages;

	const resData = listRes?.flatMap((res) => res.items) || [];
	const [data, setData] = useState<T[]>(resData);
	useEffect(() => {
		if (!validating) {
			const isSame =
				data.length === resData.length &&
				resData.every((item, index) => JSON.stringify(item) === JSON.stringify(data[index]));
			if (!isSame) setData(resData);
		}
	}, [validating]);

	const addData = (newData: T) => setData((prevData) => [newData, ...prevData]);

	const updateData = (id: string, newData: T) =>
		setData((prevData) => prevData.map((item) => (item._id === id ? newData : item)));

	const removeData = (id: string) => setData((prevData) => prevData.filter((item) => item._id !== id));

	const [loadingMore, setLoadingMore] = useState(false);
	const loadMore = () => {
		if (loadingMore || !hasMore) return;

		setLoadingMore(true);
		setPage(page + 1).finally(() => setLoadingMore(false));
	};

	return {
		data,
		listRes,
		params,
		fetching,
		loadingMore,
		validating,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
		mutate,
	};
};

export type SWRFetcherType<T extends IData, U extends IPaginationResponse<T> = IPaginationResponse<T>> = {
	data: T[];
	res?: U;
	updateData: (id: string, newData: T) => Promise<void>;
	addData: (newData: T, validate?: boolean) => Promise<void>;
	removeData: (id: string) => Promise<void>;
	fetching: boolean;
	loadingMore: boolean;
	validating: boolean;
	hasMore: boolean;
	params: IPaginationParams;
	loadMore: () => void;
	api: string;
	mutate: KeyedMutator<U>;
};

export const useSWRFetcher = <T extends IData = any, U extends IPaginationResponse<T> = IPaginationResponse<T>>({
	api,
	limit = 20,
	params: initParams = {},
}: FetcherProps): SWRFetcherType<T, U> => {
	const [data, setData] = useState<T[]>([]);
	const [hasMore, setHasMore] = useState(true);
	const [params, setParams] = useState<IPaginationParams>(initParams);
	const { page = 0, size = limit, offset = page * size } = params;

	const { mutate: globalMutate } = useSWRConfig();
	const swrKey = urlUtil.generateUrl(api, { ...params, offset, size });
	const { data: res, isValidating, isLoading, mutate } = useSWR<U>(swrKey, swrFetcher);
	useEffect(() => {
		if (res) {
			const { items, totalItems, offset } = res;
			setData((prevData) => {
				const newData = [...prevData];
				newData.splice(offset, items.length, ...items);
				return [...newData];
			});
			setHasMore(offset + items.length < totalItems);
		}
	}, [res]);

	const addData = async (newData: T) => {
		setData((prevData) => {
			const newDataList = [newData, ...prevData];
			newDataList.pop(); // Remove last item
			return newDataList;
		});

		const swrKey = urlUtil.generateUrl(api, { ...params, offset: 0, size: limit });
		await globalMutate(swrKey);
	};

	const updateData = async (id: string, newData: T) => {
		const index = data.findIndex((item) => item._id === id);
		if (index === -1) return;

		const newDataList = [...data];
		newDataList[index] = newData;
		setData(newDataList);

		const page = Math.floor(index / limit);
		const swrKey = urlUtil.generateUrl(api, { ...params, offset: page, size: limit });
		await globalMutate(swrKey);
	};

	const removeData = async (id: string) => {
		const index = data.findIndex((item) => item._id === id);
		if (index === -1) return;

		const newDataList = [...data];
		newDataList.splice(index, 1);
		setData(newDataList);

		const page = Math.floor(index / limit);
		const swrKey = urlUtil.generateUrl(api, { ...params, offset: page, size: limit });
		await globalMutate(swrKey);
	};

	const loadMore = () => {
		if (isLoading || !hasMore) return;

		const newParams = { ...params, page: page + 1 };
		setParams(newParams);
	};

	return {
		data,
		res,
		params,
		fetching: isLoading && data.length === 0,
		loadingMore: isLoading,
		validating: isValidating,
		hasMore,
		loadMore,
		addData,
		updateData,
		removeData,
		api,
		mutate,
	};
};
