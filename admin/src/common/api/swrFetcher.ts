import { AxiosRequestConfig } from 'axios';
import { apiClient } from '.';

const swrFetcher = (url: string, config?: AxiosRequestConfig) => apiClient.get(url, config).then((res) => res.data);

export { swrFetcher };
