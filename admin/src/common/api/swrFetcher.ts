import { AxiosRequestConfig } from 'axios';
import apiClient from './apiClient';

const swrFetcher = (url: string, config?: AxiosRequestConfig) => apiClient.get(url, config).then((res) => res.data);

export default swrFetcher;
