import { swrFetcher } from '@common/api';
import { IData, IPaginationParams, IPaginationResponse } from '@common/types';
import { useCallback, useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import { urlUtil } from '@common/utils';
import { KeyedMutator } from 'swr';

// T: Data type,
export type FetcherType<T extends IData, U extends IPaginationResponse<T> = IPaginationResponse<T>> = {
	data: T[];
	listRes?: U[];
	updateData: (id: string, newData: T) => void;
	addData: (newData: T, validate?: boolean) => void;
	removeData: (id: string) => void;
	fetching: boolean;
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
			const isSame = resData.every((item, index) => item._id === data[index]?._id);
			if (!isSame) setData(resData);
		}
	}, [validating]);

	const addData = (newData: T) => setData((prevData) => [newData, ...prevData]);

	const updateData = (id: string, newData: T) =>
		setData((prevData) => prevData.map((item) => (item._id === id ? newData : item)));

	const removeData = (id: string) => setData((prevData) => prevData.filter((item) => item._id !== id));

	const loadMore = () => setPage(page + 1);

	return {
		data,
		listRes,
		params,
		fetching,
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
