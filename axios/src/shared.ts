import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ResponseType } from './type';

export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json';
  return contentType;
}

/**
 * Check if the HTTP status is successful
 * 
 * @param status status code
 */
export function isHttpSuccess(status: number) {
  const isHttpSuccess = status >= 200 && status < 300;
  return isHttpSuccess || status === 304;
}

export async function transformResponse(response: AxiosResponse) {
  const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';
  if (responseType === 'json') {
    return;
  }
  // axios会把key转为小写
  const isJson = (response.headers['content-type'] as string | undefined)?.includes('application/json');
  if (!isJson) {
    return;
  }
  if (responseType === 'blob') {
    await transformBlobToJson(response);
  } else if (responseType === 'arrayBuffer') {
    await transformArrayBufferToJson(response);
  }
}

export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config;
  return responseType === 'json' || responseType === undefined;
}

export async function transformBlobToJson(response: AxiosResponse) {
  try {
    let data = response.data;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    } else if (data instanceof Blob) {
      const json = await data.text();
      data = JSON.parse(json);
    }

    response.data = data;

  } catch { }
}

export async function transformArrayBufferToJson(response: AxiosResponse) {
  try {
    let data = response.data;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    } else if (data instanceof ArrayBuffer) {
      const json = new TextDecoder().decode(data);
      data = JSON.parse(json);
    }
    response.data = data;
  } catch { }
}