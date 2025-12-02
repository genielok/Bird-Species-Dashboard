import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
}

export const BASE_URL = "http://127.0.0.1:8000/api"
// export const BASE_URL = "https://birdnet-api-service.onrender.com"

const service: AxiosInstance = axios.create({
    baseURL: BASE_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

// --- Request Interceptor ---
service.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// --- Response Interceptor ---
service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
        const res = response.data;
        if (res.code !== 200) {
            return Promise.reject(new Error(res.message || 'Error'));
        } else {
            return res.data;
        }
    },
    (error) => {
        console.error('Response Error:', error);
        return Promise.reject(error);
    }
);

// --- API Abstraction Layer ---
/**
 * Generic request wrapper using fetch
 * @param options - Request options including method, url, data, and params
 * @returns Promise<T>
 */
async function request<T = any>(options: { method: 'get' | 'post'; url: string; data?: object | FormData; params?: any; responseType?: 'json' | 'blob'; }): Promise<T> {
    const { method, url, data, params } = options;
    const responseType = options.responseType || params?.responseType || 'json';
    if (params?.responseType) delete params.responseType;

    const requestOptions: RequestInit = {
        method: method.toUpperCase(),
    };

    let finalUrl = BASE_URL + url;

    if (method === 'get' && params) {
        const query = new URLSearchParams(params as Record<string, string>).toString();
        if (query) {
            finalUrl += `?${query}`;
        }
    }

    if (data) {
        if (data instanceof FormData) {
            requestOptions.body = data;
        } else {
            requestOptions.body = JSON.stringify(data);
            requestOptions.headers = {
                'Content-Type': 'application/json',
            };
        }
    }

    const response = await fetch(finalUrl, requestOptions);

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (responseType === 'blob') {
        return response.blob() as Promise<T>;
    }
    return response.json() as Promise<T>;
}


/**
 * Wrapped GET request
 * @param url - The request URL
 * @param params - The request parameters
 * @returns Promise<T>
 */
export const get = <T = any>(url: string, params?: any): Promise<T> => {
    return request<T>({
        method: 'get',
        url,
        params,
        responseType: params?.responseType,
    });
};

/**
 * Wrapped POST request
 * @param url - The request URL
 * @param data - The request body data
 * @returns Promise<T>
 */
export const post = <T = any>(url: string, data?: object | FormData): Promise<T> => {
    return request<T>({
        method: 'post',
        url,
        data,
    });
};

export default request;